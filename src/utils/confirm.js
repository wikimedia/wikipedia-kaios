import { usePopup } from 'hooks'
import { ConfirmDialog } from 'components'

export const confirmDialog = ({ title, message, onSubmit }) => {
  const [showConfirmDialog] = usePopup(ConfirmDialog, { stack: true })
  showConfirmDialog({ title, message, onSubmit })
}
