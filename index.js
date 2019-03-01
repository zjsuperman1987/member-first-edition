axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/index_data')
  .then(function (response) {
    console.log(response.data);
    var img = $('<img>')
    img.attr('src', response.data.headerCarouse[0].imgUrl)
    $('.header').append(img);

  })
  .catch(function (error) {
    console.log(error);
  });