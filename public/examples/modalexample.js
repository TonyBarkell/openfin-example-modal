async function closeWindow(){
    const finWindow = await fin.desktop.Window.getCurrent();
    return await finWindow.hide();
};