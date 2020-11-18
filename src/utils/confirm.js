import { usePopup } from 'hooks'
import { ConfirmDialog } from 'components'

export const confirmDialog = ({ title, message, onDiscard = () => {}, onSubmit = () => {} }) => {
  const [showConfirmDialog] = usePopup(ConfirmDialog, { stack: true })
  showConfirmDialog({ title, message, onDiscard, onSubmit })
}
