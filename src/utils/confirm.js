import { usePopup } from 'hooks'
import { ConfirmDialog } from 'components'

export default function ({ message, onSubmit }) {
  const [showConfirmDialog] = usePopup(ConfirmDialog, { position: 'auto' })
  showConfirmDialog({ message, onSubmit })
}
