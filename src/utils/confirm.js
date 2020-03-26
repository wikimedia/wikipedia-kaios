import { usePopup } from 'hooks'
import { ConfirmDialog } from 'components'

export const confirmDialog = ({ message, onSubmit }) => {
  const [showConfirmDialog] = usePopup(ConfirmDialog, { stack: true })
  showConfirmDialog({ message, onSubmit })
}
