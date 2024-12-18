// 工作栏 - 插入控件
import { Col, Divider, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { mergeRegister } from '@lexical/utils';
import { DefaultOptionType } from 'antd/es/select';
import { COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from 'lexical';
// import { DEFAULT_ANTD_COMPONENT_SIZE } from '../../config/AntdUiConfig';
import {
  EDU_INSERT_MATHJAX_MODAL_COMMAND,
  EDU_INSERT_TABLE_COMMAND,
  INSERT_BLANK_COMMAND,
  REPLACE_BLANK_COMMAND,
} from '../../config/GlobalCommand';
import { PluginsType } from '../../config/PluginsConfig';
import { initInsertOptions, InsertTypeEnum } from './config';
import { decision } from './decision';

interface InsertToolPropsType {
  plugins?: PluginsType;
}

const InsertTool = (props: InsertToolPropsType) => {
  const { plugins } = props;
  const [editor] = useLexicalComposerContext();

  const [value, setValue] = useState(InsertTypeEnum.none);
  const [options, setOptions] = useState<DefaultOptionType[]>(() => initInsertOptions(plugins));

  const changeCallback = useCallback(
    (value: InsertTypeEnum) => {
      switch (value) {
        case InsertTypeEnum.insertBlank:
          editor.dispatchCommand(INSERT_BLANK_COMMAND, {});
          break;
        case InsertTypeEnum.replaceBlank:
          editor.dispatchCommand(REPLACE_BLANK_COMMAND, undefined);
          break;
        case InsertTypeEnum.table:
          editor.dispatchCommand(EDU_INSERT_TABLE_COMMAND, {});
          break;
        case InsertTypeEnum.mathJax:
          editor.dispatchCommand(EDU_INSERT_MATHJAX_MODAL_COMMAND, {});
          break;
        default:
          void null;
      }

      setValue(InsertTypeEnum.none);
    },
    [editor],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          setOptions(options => {
            return decision(options);
          });

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return options?.length ? (
    <>
      <Col>
        <Divider />
      </Col>
      <Col>
        <Select
          // size={DEFAULT_ANTD_COMPONENT_SIZE}
          value={value}
          defaultValue={value}
          defaultActiveFirstOption
          style={{ width: 100 }}
          bordered={false}
          options={options}
          disabled={!editor.isEditable()}
          onChange={changeCallback}
        />
      </Col>
    </>
  ) : (
    <></>
  );
};

export { InsertTool };
