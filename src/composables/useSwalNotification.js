import Swal from 'sweetalert2'

/**
 * Composable for handling SweetAlert notifications
 */
export function useSwalNotification() {
  /**
   * Show a success notification with timer
   * @param {string} title - The title of the notification
   * @param {string} text - The text content of the notification
   * @param {number} timer - The time in milliseconds before the notification auto-closes (default: 3000)
   */
  const showSuccess = (title = 'Success', text = 'Operation completed successfully!', timer = 3000) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      timer,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }

  /**
   * Show an error notification
   * @param {string} title - The title of the notification
   * @param {string} text - The text content of the notification
   */
  const showError = (title = 'Error', text = 'An error occurred!') => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }

  /**
   * Show a validation error notification
   * @param {string} title - The title of the notification
   * @param {string} text - The text content of the notification
   */
  const showValidationError = (title = 'Validation Error', text = 'Please correct the errors below') => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }

  /**
   * Show a confirmation dialog
   * @param {string} title - The title of the dialog
   * @param {string} text - The text content of the dialog
   * @param {string} confirmText - The text for the confirm button
   * @param {string} cancelText - The text for the cancel button
   */
  const showConfirm = (title = 'Are you sure?', text = '', confirmText = 'Yes', cancelText = 'Cancel') => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText
    })
  }

  return {
    showSuccess,
    showError,
    showValidationError,
    showConfirm
  }
}