import { usePopup } from 'hooks'
import { ConfirmDialog } from 'components'

export const confirmDialog = ({ message, onSubmit }) => {
  const [showConfirmDialog] = usePopup(ConfirmDialog, { position: 'auto' })
  showConfirmDialog({ message, onSubmit })
}
