import { usePopup } from 'hooks'
import { ConfirmDialog } from 'components'

export const useConfirmDialog = () => {
  const [showPopup] = usePopup(ConfirmDialog, { stack: true })
  const showConfirmDialog = ({
  	title, message, onDiscardText, onDiscard = () => {},
  	onSubmitText, onSubmit = () => {}
	}) => {
		showPopup({ title, message, onDiscardText, onDiscard, onSubmitText, onSubmit })
	}
  return showConfirmDialog
}
