import { InlineField } from 'react-tinacms-inline'

interface InlineWysiwygFieldProps {
  name: string
}

export function InlineImage(props) {
  return (
    <InlineField name={name}>
      {({ input, status }) => {
        if (status === 'active') {
          return <ImageField input={input} />
        }
        return <img />
      }}
    </InlineField>
  )
}

//***------------ FROM TINA-------------------------- */
import * as React from 'react'
import { useCMS } from 'tinacms'
import { InputProps, ImageUpload } from '@tinacms/fields'
// import { useCMS } from '../../react-tinacms'
// import { parse } from './textFormat'

const parse = (value?: string) => value || ''

type FieldProps = any
interface ImageProps {
  path: string
  previewSrc(form: any, field: FieldProps): string
  uploadDir(form: any): string
  clearable?: boolean // defaults to true
}

export const ImageField = props => {
  const cms = useCMS()

  return (
    <ImageUpload
      value={props.input.value}
      previewSrc={props.field.previewSrc(props.form.getState().values, props)}
      /*
       ** write the custom onDrop, posts to github api
       ** and writes the url that gets returned
       */
      onDrop={(acceptedFiles: any[]) => {
        acceptedFiles.forEach(async (file: any) => {
          await cms.api.git!.onUploadMedia!({
            directory: props.field.uploadDir(props.form.getState().values),
            content: file,
          })
          props.input.onChange(file.name)
        })
      }}
      onClear={
        props.field.clearable === false
          ? undefined
          : () => {
              props.input.onChange('')
            }
      }
    />
  )
}

export default {
  name: 'image',
  Component: ImageField,
  parse,
}
