/*==========================================================
# ドロワーメニュー
===========================================================*/
$('.c-hamburger').on('click',function(e) {
    e.preventDefault();
  
    $('.c-hamburger').toggleClass('is-active');
    $('.l-header-nav').toggleClass('is-active'); // ドロワーメニューの表示状態を切り替える
    $('.c-hamburger-icon').toggleClass('is-active'); // ドロワーメニューの表示状態を切り替える
    $('.wrapper').toggleClass('is-active'); 
  
    return false;
});


// ナビメニュー内のliをクリックしたときにメニューを閉じる
$('.l-header-nav li').on('click', function() {
  $('.c-hamburger').removeClass('is-active');
  $('.l-header-nav').removeClass('is-active'); // ドロワーメニューの表示状態を非表示にする
  $('.c-hamburger-icon').removeClass('is-active'); // ドロワーメニューの表示状態を非表示にする
  $('.wrapper').removeClass('is-active');
});


/*==========================================================
# スクロールアニメーション
===========================================================*/
  // 動きのきっかけの起点となるアニメーションの名前を定義
  function stepsAnime(){

	$('.stepsTrigger').each(function(){ //stepsTriggerというクラス名が
		var elemPos = $(this).offset().top-50;//要素より、50px上の
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		if (scroll >= elemPos - windowHeight){
		$(this).addClass('steps');// 画面内に入ったらstepsというクラス名を追記
    // console.log('steps added'); // デバッグ用
    }else{
		$(this).removeClass('steps');// 画面外に出たらstepsというクラス名を外す
    // console.log('steps removed'); // デバッグ用	
  }
		});

}

// 画面をスクロールをしたら動かしたい場合の記述
	$(window).scroll(function (){
		stepsAnime();/* アニメーション用の関数を呼ぶ*/
	});// ここまで画面をスクロールをしたら動かしたい場合の記述

// 画面が読み込まれたらすぐに動かしたい場合の記述
	$(window).on('load', function(){
		stepsAnime();/* アニメーション用の関数を呼ぶ*/
	});// ここまで画面が読み込まれたらすぐに動かしたい場合の記述


/*==========================================================
# ローディングアニメーション
===========================================================*/
//SVGアニメーションの描画


var stroke;
stroke = new Vivus('mask', {//アニメーションをするIDの指定
    start:'manual',//自動再生をせずスタートをマニュアルに
    type: 'scenario-sync',// アニメーションのタイプを設定
    duration: 10,//アニメーションの時間設定。数字が小さくなるほど速い
    forceRender: false,//パスが更新された場合に再レンダリングさせない
    animTimingFunction:Vivus.EASE,//動きの加速減速設定
},
function(){
       $("#mask").attr("class", "done");//描画が終わったらdoneというクラスを追加
}
);

$(window).on('load',function(){
  $("#splash").delay(3490).fadeOut('slow');//ローディング画面を3秒（3000ms）待機してからフェイドアウト
	$("#splash_logo").delay(3490).fadeOut('slow');//ロゴを3秒（3000ms）待機してからフェイドアウト
        stroke.play();//SVGアニメーションの実行
});


/*==========================================================
# coffeeアニメーション
===========================================================*/
document.addEventListener("DOMContentLoaded", function() {
    const beforeImage = document.querySelector('.c-coffee__image-before');
    const afterImage = document.querySelector('.c-coffee__image-after');

    // 5秒後に実行
    setTimeout(() => {
        beforeImage.style.transform = 'rotateY(-180deg)';
        afterImage.style.transform = 'rotateY(0deg)';
        afterImage.style.zIndex = '1';
    }, 5800);
});

/*==========================================================
# swiper
===========================================================*/


var swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: {
    delay: 2000, // スライドが切り替わるまでの時間（ミリ秒）
    disableOnInteraction: false
  },
  speed: 2000, // スライドが切り替わるアニメーションの時間（ミリ秒）
  on: {
    init: function() {
      // スライダーが初期化されたときにアニメーションを設定
      var slides = document.querySelectorAll('.swiper-slide');
      slides.forEach(function(slide) {
        slide.style.animation = 'none';
        slide.offsetHeight; // 強制的にリフローを発生させる
        slide.style.animation = 'slideAnimation 5100ms linear infinite';
      });
      
      // 最初は自動再生を止めておく
      swiper.autoplay.stop();
      
      // 5秒後にスライドショーを開始
      setTimeout(function() {
        swiper.autoplay.start();
      }, 30000);
      
    },
    }
  });

swiper.init();
