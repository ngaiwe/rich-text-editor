// 工作栏 - 上传图片控件
import {FileImageOutlined} from '@ant-design/icons'
import {message, Space, Upload} from 'antd'
import {UploadChangeParam, UploadFile} from 'antd/es/upload'
import {useCallback, useMemo} from 'react'

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {UplaodImageResponseType} from '../../@types/image'
import {INSERT_IMAGE_COMMAND} from '../../config/GlobalCommand'
import {
  IMAGE_TYPE_WHITE,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_TEXT,
} from '../../config/GlobalConstant'

export interface UploadPropsType {
  action?: string
}

const UploadPropsStatic = {
  name: 'images',
  action: '/api/odin/upload_image',
  maxCount: 1,
  accept: IMAGE_TYPE_WHITE.join(','),
  showUploadList: false,
  withCredentials: true,
}

const UploadImageTool = (props: any) => {
  const [editor] = useLexicalComposerContext()
  const params = useMemo(
    () => Object.assign({}, UploadPropsStatic, props),
    [props],
  )

  const onChange = useCallback(
    (info: UploadChangeParam<UploadFile<UplaodImageResponseType[]>>) => {
      const {name, status, response} = info.file
      const {width, height, filename, full_url: url} = response?.[0] || {}

      switch (status) {
        case 'done':
          if (!url) {
            message.error(`${name} 上传失败, 图片 url 不存在`)
            return
          }
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: url || '',
            width: width || 0,
            height: height || 0,
            altText: filename || 'undefined',
          })
          break
        case 'error':
          message.error(`${name} 上传失败`)
          break
      }
    },
    [editor],
  )

  // 上传拦截
  const beforeUploadCallback = useCallback((file: any) => {
    if (!file) {
      return false
    }

    if (!IMAGE_TYPE_WHITE.includes(file?.type || '')) {
      message.warning(
        `图片格式有误 ${file?.type}, 仅支持 ${IMAGE_TYPE_WHITE.join(',')} 格式`,
      )

      return false
    }

    if (file?.size && file?.size > MAX_IMAGE_SIZE) {
      message.warning(`图片大小超过 ${MAX_IMAGE_SIZE_TEXT}`)
      return false
    }

    return file
  }, [])

  return (
    <Upload
      {...params}
      capture={false}
      disabled={!editor.isEditable()}
      beforeUpload={beforeUploadCallback}
      onChange={onChange}
    >
      <Space>
        <FileImageOutlined />
        <span>图片</span>
      </Space>
    </Upload>
  )
}

export {UploadImageTool}
