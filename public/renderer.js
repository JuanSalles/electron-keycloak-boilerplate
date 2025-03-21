window.electron.ipcRenderer.invoke('get-token-info').then((tokenInfo) => {
  // Exibe as informações na nova página
  document.getElementById('username').textContent =
    tokenInfo.username || 'Não disponível';
  document.getElementById('roles').textContent =
    (tokenInfo.realm_access?.roles || []).join(', ') || 'Nenhuma';
});

// Lógica para o botão de logout
document.getElementById('logout-button').addEventListener('click', () => {
  // Envia o evento de logout para o processo principal
  window.electron.ipcRenderer.send('logout');
});
