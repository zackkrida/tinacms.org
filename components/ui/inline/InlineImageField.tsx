import { InlineField } from 'react-tinacms-inline'
import { useCMS } from 'tinacms'
import { useDropzone } from 'react-dropzone'

import { saveContent } from '../../../open-authoring/github/api'
import { getCachedFormData, setCachedFormData } from '../../../utils/formCache'
import { GithubOptions } from '../../../utils/github/useGithubForm'
import { FORM_ERROR } from 'final-form'

/**
 * InlineImageField
 */
interface InlineImageProps {
  name: string
  uploadPath(form: any): string
  githubOptions: any
}

const loadFile = (file: File): Promise<string> => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => {
      resolve(event.target.result as string)
    }
    reader.onerror = event => {
      reject('Image failed to upload')
    }
    return reader.readAsDataURL(file)
  })
}

export function InlineImageField({
  name,
  uploadPath,
  githubOptions,
}: InlineImageProps) {
  return (
    <InlineField name={name}>
      {props => {
        if (props.status === 'active') {
          return (
            <ImageUpload
              value={props.input.value}
              onDrop={async ([file]: File[]) => {
                const directory = uploadPath(file.name)
                const loadedFile = await loadFile(file)
                saveContent(
                  githubOptions.forkFullName,
                  githubOptions.branch,
                  directory,
                  getCachedFormData(directory).sha,
                  loadedFile.replace(/^data:image\/[a-z]+;base64,/, ''),
                  'Update from TinaCMS'
                )
                  .then(response => {
                    props.input.onChange(`/img/${response.content.name}`)
                    setCachedFormData(directory, {
                      sha: response.content.sha,
                    })
                  })
                  .catch(e => {
                    return { [FORM_ERROR]: 'Failed to add new image' }
                  })
                return null
              }}
              {...props.input}
            />
          )
        }
        return <img src={props.input.value} />
      }}
    </InlineField>
  )
}

interface ImageUploadProps {
  onDrop: (acceptedFiles: any[]) => void
  value?: string
}

export const ImageUpload = ({ onDrop, value }: ImageUploadProps) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: 'image/*', onDrop })

  return (
    <div {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
      <input {...getInputProps()} />
      {value ? (
        <div>
          <img src={value} />
        </div>
      ) : (
        <div>
          Drag 'n' drop some files here,
          <br />
          or click to select files
        </div>
      )}
    </div>
  )
}
