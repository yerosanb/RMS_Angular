$(document).ready(function () {
  $('[data-password]').on('click', function () {
    'false' == $(this).attr('data-password')
      ? ($(this).siblings('input').attr('type', 'text'),
        $(this).attr('data-password', 'true'),
        $(this).addClass('show-password'))
      : ($(this).siblings('input').attr('type', 'password'),
        $(this).attr('data-password', 'false'),
        $(this).removeClass('show-password'))
  })
  tinymce.init({
    selector: '#mytextarea',
    // height: 500,
    // menubar: false,
    // plugins: [
    //   'advlist autolink lists link image charmap print preview anchor',
    //   'searchreplace visualblocks code fullscreen',
    //   'insertdatetime media table paste code help wordcount',
    // ],
    // toolbar:
    //   'undo redo | formatselect | ' +
    //   'bold italic backcolor | alignleft aligncenter ' +
    //   'alignright alignjustify | bullist numlist outdent indent | ' +
    //   'removeformat | help',
    // content_style:
    //   'body { font-family:Helvetica,Arial,sans-serif; font-size:24px }',
    promotion: false,
  })
})
