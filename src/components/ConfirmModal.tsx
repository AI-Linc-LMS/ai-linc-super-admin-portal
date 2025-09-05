import Modal from './Modal'

type Props = {
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={(
        <>
          <button onClick={onClose} className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700">{cancelText}</button>
          <button
            onClick={() => { onConfirm(); }}
            className={
              `px-3 py-1.5 rounded text-white ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`
            }
          >
            {confirmText}
          </button>
        </>
      )}
    >
      {message ? <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p> : null}
    </Modal>
  )
}

