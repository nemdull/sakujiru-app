if(location.pathname == "/swipe") {
  $(function(){

    // クリックイベント
    function createButtonListener(reaction) {
      let cards = document.querySelectorAll('.swipe--card:not(.removed)');

      if (!cards.length) return false;

      let moveOutWidth = document.body.clientWidth * 2;

      let card = cards[0];
      card.classList.add('removed');

      if (reaction == "like") {
        card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      } else {
        card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
      }
    }

    // クリックイベント(リアクションを返す)
    $('#like').on('click', function() {
      createButtonListener("like");
    })

    $('#dislike').on('click', function() {
      createButtonListener("dislike");
    })
  });
}
