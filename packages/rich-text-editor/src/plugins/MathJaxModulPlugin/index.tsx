import 'katex/dist/katex.min.css'
import './index.less'

import domtoimage from 'dom-to-image-more'
import {useCallback, useEffect, useRef, useState} from 'react'

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {COMMAND_PRIORITY_EDITOR} from 'lexical'

import {mergeRegister} from '@lexical/utils'
import {Form, Input, message, Modal} from 'antd'
import {
  EDU_INSERT_MATHJAX_MODAL_COMMAND,
  INSERT_IMAGE_COMMAND,
  REPLACW_IMAGE_COMMAND,
} from '../../config/GlobalCommand'
import {ImageNode} from '../../nodes/ImageNode'
import {
  DEFAULT_FORM_CONFIG,
  DEFAULT_FORM_ID,
  DEFAULT_FORM_VALUE,
} from './config'
import MathComponent, {MathComponentRef} from './MathComponent'

export interface MathJaxModulPluginPropsType {
  action?: string
}

export default function MathJaxModulPlugin(props: MathJaxModulPluginPropsType) {
  const {action = '/api/odin/upload_image'} = props

  const [form] = Form.useForm()
  const [editor] = useLexicalComposerContext()
  const [modalStatus, setModalStatus] = useState(false)
  const [mathText, setMathText] = useState('')
  const [nodeKey, setNodeKey] = useState<string | undefined>(undefined)
  const mathRef = useRef<MathComponentRef>(null)

  const closeModal = useCallback(() => {
    form.resetFields()
    setMathText('')
    setNodeKey('')
    setModalStatus(false)
  }, [form])

  const onFinish = useCallback(() => {
    try {
      const dom = mathRef.current?.getMathKatexDom?.() as unknown as HTMLElement
      const {width, height} = dom.getBoundingClientRect()

      domtoimage
        .toBlob(dom, {
          width: Math.ceil(width),
          height: Math.ceil(height),
        })
        .then(async (blob: Blob) => {
          const formdata = new FormData()
          formdata.append(
            'images',
            blob,
            `mathJax-${Date.now().toString(16)}.png`
          )

          const response = await fetch(action, {
            method: 'POST',
            body: formdata,
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
          })

          const res = (await response.json()) as Array<{
            // eslint-disable-next-line camelcase
            full_url: string
            width: number
            height: number
            filename: string
          }>
          const {full_url: fullUrl, width, height, filename} = res?.[0] ?? {}

          editor.dispatchCommand(
            nodeKey ? REPLACW_IMAGE_COMMAND : INSERT_IMAGE_COMMAND,
            {
              src: fullUrl || '',
              width: width || 0,
              height: height || 0,
              altText: filename || 'undefined',
              attrMathJax: encodeURIComponent(mathText),
              nodeKey,
            }
          )

          closeModal()
        })
        .catch(error => message.error(`插入公式失败: ${error}`))
    } catch (error) {
      message.error(`插入公式失败: ${error}`)
    }
  }, [action, editor, nodeKey, mathText, closeModal])

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand(
        EDU_INSERT_MATHJAX_MODAL_COMMAND,
        ({nodeKey, attrMathJax}) => {
          if (attrMathJax) {
            const mathText = decodeURIComponent(attrMathJax)
            form.setFieldsValue({
              mathText,
            })
            setMathText(mathText)
            setNodeKey(nodeKey)
          }

          setModalStatus(true)

          return true
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [editor, form])

  return (
    <Modal
      title="插入公式"
      okText="确认"
      cancelText="取消"
      forceRender
      open={modalStatus}
      onOk={() => form.submit()}
      onCancel={closeModal}
    >
      <Form
        form={form}
        name={DEFAULT_FORM_ID}
        labelCol={{span: 4}}
        wrapperCol={{span: 24}}
        initialValues={DEFAULT_FORM_VALUE}
        onFinish={onFinish}
        onFinishFailed={error =>
          message.error(`插入公式失败: ${JSON.stringify(error)}`)
        }
        onValuesChange={({mathText}) => setMathText(mathText || '')}
      >
        <Form.Item name="mathText" rules={DEFAULT_FORM_CONFIG.mathText.rules}>
          <Input.TextArea rows={3} placeholder="请输入公式" />
        </Form.Item>
      </Form>
      <div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          输出公式
        </div>
        <div
          style={{
            width: 'auto',
            height: 'auto',
            overflowX: 'auto',
          }}
        >
          <MathComponent ref={mathRef} mathText={mathText} />
        </div>
      </div>
    </Modal>
  )
}
