export function sum(a: number, b: number) {
  return a + b
}
export function sub(a: number, b: number) {
  return a - b
}
export function mult(a: number, b: number) {
  return a * b
}
export function div(a: number, b: number) {
  return a / b
}
export function loadDatatableScripts() {
  const dynamicScripts = [
    '../../../../assets/common/jquery-3.6.3.min.js',
    '../../../../assets/template_assets/js/vendor/jquery.dataTables.min.js',
    '../../../../assets/template_assets/js/vendor/dataTables.bootstrap5.js',
    '../../../../assets/template_assets/js/vendor/dataTables.responsive.min.js',
    '../../../../assets/template_assets/js/vendor/responsive.bootstrap5.min.js',
    '../../../../assets/template_assets/js/vendor/dataTables.buttons.min.js',
    '../../../../assets/template_assets/js/vendor/buttons.bootstrap5.min.js',
    '../../../../assets/template_assets/js/vendor/buttons.html5.min.js',
    '../../../../assets/template_assets/js/vendor/buttons.flash.min.js',
    '../../../../assets/template_assets/js/vendor/buttons.print.min.js',
    '../../../../assets/template_assets/js/vendor/dataTables.keyTable.min.js',
    '../../../../assets/template_assets/js/vendor/dataTables.select.min.js',
    // '../../../../assets/template_assets/js/pages/demo.datatable-init.js',

    // 'https://cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js',
    '../../../../assets/common/mukera.js',
    // '../../../assets/js/dummyjs.min.js',
  ]
  for (let i = 0; i < dynamicScripts.length; i++) {
    const node = document.createElement('script')
    node.src = dynamicScripts[i]
    node.type = 'text/javascript'
    // node.async = false
    // node.charset = 'utf-8'
    document.getElementsByTagName('head')[0].appendChild(node)
  }
}
/*
  <script src=""></script>

*/
