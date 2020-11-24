import { usePopup } from 'hooks'
import { ConfirmDialog } from 'components'

export const confirmDialog = ({
  title, message, onDiscardText, onDiscard = () => {},
  onSubmitText, onSubmit = () => {}
}) => {
  const [showConfirmDialog] = usePopup(ConfirmDialog, { stack: true })
  showConfirmDialog({ title, message, onDiscardText, onDiscard, onSubmitText, onSubmit })
}
