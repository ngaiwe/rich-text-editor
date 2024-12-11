import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND, TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { mergeRegister } from '@lexical/utils';
import { Form, InputNumber, message, Modal } from 'antd';
import { COMMAND_PRIORITY_EDITOR } from 'lexical';
import pick from 'lodash/pick';
import { useCallback, useEffect, useState } from 'react';
import { EDU_INSERT_TABLE_COMMAND } from '../../config/GlobalCommand';
import { DEFAULT_FORM_CONFIG, DEFAULT_FORM_ID, DEFAULT_FORM_VALUE } from './config';

export interface TablePluginCommandType {
  type?: string;
}

const TableModalPlugin = () => {
  const [form] = Form.useForm();
  const [editor] = useLexicalComposerContext();
  const [modalStatus, setModalStatus] = useState(false);

  const cancelCallback = useCallback(() => {
    setModalStatus(false);
  }, []);

  const onFinish = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (values: any) => {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, pick(values, ['rows', 'columns']));
      setModalStatus(false);
    },
    [editor],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = useCallback(({ errorFields }: { errorFields: any[] }) => {
    message.open({
      type: 'error',
      content: JSON.stringify(errorFields),
    });
  }, []);

  useEffect(() => {
    !modalStatus && form?.resetFields();
  }, [form, modalStatus]);

  useEffect(() => {
    if (!editor.hasNodes([TableCellNode, TableNode, TableRowNode])) {
      throw new Error(
        'TablePlugin: [TableCellNode, TableNode, TableRowNode] not registered on editor',
      );
    }

    return mergeRegister(
      editor.registerCommand(
        EDU_INSERT_TABLE_COMMAND,
        () => {
          setModalStatus(true);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return (
    <Modal
      title="插入表格"
      okText="确认"
      cancelText="取消"
      forceRender
      open={modalStatus}
      onOk={() => form.submit()}
      onCancel={cancelCallback}
    >
      <Form
        form={form}
        name={DEFAULT_FORM_ID}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        initialValues={DEFAULT_FORM_VALUE}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="行" name="rows" rules={DEFAULT_FORM_CONFIG.rows.rules}>
          <InputNumber min={1} max={100} />
        </Form.Item>
        <Form.Item label="列" name="columns" rules={DEFAULT_FORM_CONFIG.columns.rules}>
          <InputNumber min={1} max={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableModalPlugin;
