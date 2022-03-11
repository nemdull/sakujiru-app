if(location.pathname == "/swipe") {
  $(function(){

    // ①クリックイベント(リアクションを返す)
    $('#like').on('click', function() {
      createButtonListener("like");
    })

    $('#dislike').on('click', function() {
      createButtonListener("dislike");
    })

    // ②クリックイベント
    function createButtonListener(reaction) {
      let cards = document.querySelectorAll('.swipe--card:not(.removed)');

      if (!cards.length) return false;

      let moveOutWidth = document.body.clientWidth * 2;

      let card = cards[0];

      let post_id = card.id;

      postReaction(post_id);

      card.classList.add('removed');

      if (reaction == "like") {
        card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      } else {
        card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
      }
    }

    // ③ポストリアクション
    function postReaction(post_id) {
      $.ajax({
        url: "reactions",
        type: "POST",
        datatype: "json",
        data: {
          post_id: post_id,
        }
      })
      .done(function () {
        console.log("done!")
      })
    }


  });
}
