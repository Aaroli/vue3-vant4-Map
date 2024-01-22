// 封装一个自动聚焦的函数,兼容ios和安卓
const autofocusFn = () => {
    const doc = document
    const input = doc.querySelector('#hide-focus-input')
    let dom = null
    // 1.检查文档有没有一个id为hide-focus-input的input标签
    // 2.如果有,dom等于这个input标签
    // 3.如果没有，则创建一个id为hide-focus-input的input标签，并添加样式(第一次执行时走这步)
    // 4.调通input的原生focus方法来聚焦
    if (input) {
        dom = input
    } else {
        dom = doc.createElement('input')
        dom.setAttribute('id', 'hide-focus-input')
        dom.style = 'position: absolute; z-index: -9999; width: 0; height: 0; left:-9999px; top:0 '
        doc.body.appendChild(dom)
    }
    dom.focus()
}
//如果是封装在一个js文件，则暴露出去，在用的地方用import引入
export { autofocusFn }