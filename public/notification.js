document.addEventListener('DOMContentLoaded', () => {
  const notifyBtn = document.getElementById('enable-notifications');

  if (!notifyBtn) return;

  updateNotifyButton();

  notifyBtn.addEventListener('click', async () => {
    const status = localStorage.getItem('notifications');

    if (Notification.permission === 'granted' && status !== 'off') {
      localStorage.setItem('notifications', 'off');
      alert('Уведомления отключены');
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem('notifications', 'on');
        alert('Уведомления включены!');
      }
    }
    updateNotifyButton();
  });

  function updateNotifyButton() {
    const status = localStorage.getItem('notifications');
    if (Notification.permission === 'granted' && status !== 'off') {
      notifyBtn.textContent = 'Отключить уведомления';
    } else {
      notifyBtn.textContent = 'Включить уведомления';
    }
  }
});

function showPushNotification(title, body) {
  const status = localStorage.getItem('notifications');
  if (Notification.permission === 'granted' && status !== 'off') {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg?.showNotification(title, {
        body,
        icon: 'icons/icon-192.png'
      });
    });
  }
}

async function checkReminders() {
  const tasks = await getTasks();
  const hasActive = tasks.some(t => !t.completed);
  if (hasActive) {
    showPushNotification('Напоминание', 'У вас есть невыполненные задачи');
  }
}

window.showPushNotification = showPushNotification;
window.checkReminders = checkReminders;
