const gulp =require ("gulp");
const sass =require("gulp-sass")(require("sass"));
const postcss =require("gulp-postcss");
const autoprefixer =require ("autoprefixer");
const cssSorter =require("css-declaration-sorter");
const mmq = require("gulp-merge-media-queries");
const browserSync =require("browser-sync");
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// const htmlBeautify =require("gulp-html-beautify");


function compileSass() {
    return gulp.src("./sass/**/*.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer(),cssSorter()]))
    .pipe(mmq())
    .pipe(gulp.dest("./css/"))
    // .pipe(cleanCss())
    // .pipe(rename( {
    //     suffix:".min"
    //     }))
    //     .pipe(gulp.dest("./public/assets/css/"))
    
    /* 
    ------------------------------------------*/
    // .pipe(
    //   //SCSS画像URLの最適化
    //   postcss([
    //   postcssUrl({
    //   // ここでURLの変換を実行
    //   url: (asset) => {
    //   // URLのパスから `../../` を `../` に変換
    //   return asset.url.replace(/\.\.\/\.\.\/\i\m\g/g, "../img");
    //   },
    //   }),
    //   ])
    //   )
      /* 
      ------------------------------------------*/

    }

    function browserInit(done) {
        browserSync.init( {
            server : {
                baseDir:"./public/"
            }
        });
        done();
    }
    
    function browserReload(done) {
        browserSync.reload();
        done();
    }
    
    function minJS() {
      return gulp.src("./src/assets/js/*.js")
      .pipe(uglify())
      .pipe(rename({
          suffix:".min"
      }))
      .pipe(gulp.dest("./public/assets/js/"))
    }
    
    // function formatHTML(){
    //     return gulp.src("./src/**/*.html")
    //     .pipe(htmlBeautify( {
    //         indent_size:2,
    //         indent_with_tabs:true,
    //     }))
    //     .pipe(gulp.dest("./public"))
    // }
     
    function copyImage() {
        return gulp.src("./src/assets/img/*")
        //
        .pipe(gulp.dest("./public/assets/img/"))
    }

// /*==========================================================
// #// SCSSをコンパイルするタスク 
// ===========================================================*/
// gulp.task('sass', function () {
//   return gulp.src("./src/assets/sass/**/*.scss") // SCSSファイルのパス
//       .pipe(sass().on('error', sass.logError))
//       .pipe(replace('../../img/', '../img/')) // 置換するパス
//       .pipe(gulp.dest("./public/assets/css/")); // 出力先のパス
// });
// /*==========================================================
// # 
// ===========================================================*/




function watch() {
    gulp.watch("./sass/**/*.scss",compileSass);
    // gulp.watch("./src/assets/sass/**/*.scss",gulp.series(compileSass,browserReload));
    // gulp.watch("./src/assets/js/*.js",gulp.series(minJS,browserReload));
    // gulp.watch("./src/assets/img/*",gulp.series(copyImage,browserReload));
    // gulp.watch("./public/*.html",gulp.series('create-scss'));
    
}


/*==========================================================
# FLOCSS式で記述した際にcomponent,layout,project,utilityに自動付与する設定

※始めにターミナルへ npm install gulp gulp-cheerio でインストールが必要
===========================================================*/
const cheerio = require('gulp-cheerio');
const fs = require('fs');
const path = require('path');



gulp.task('create-scss', function () {
  return gulp.src('public/**/*.html') // 'public' ディレクトリ内の HTML ファイルを対象に設定
    .pipe(cheerio(function ($) {
      // 各フォルダの _index.scss ファイルのパス
      const layoutIndexScssPath = 'src/assets/sass/layout/_index.scss';
      const projectIndexScssPath = 'src/assets/sass/project/_index.scss';
      const componentIndexScssPath = 'src/assets/sass/component/_index.scss';
      const utilityIndexScssPath = 'src/assets/sass/utility/_index.scss';

      // 各フォルダの _index.scss の内容を読み込む
      let layoutIndexScssContent = fs.existsSync(layoutIndexScssPath) ? fs.readFileSync(layoutIndexScssPath, 'utf8') : '';
      let projectIndexScssContent = fs.existsSync(projectIndexScssPath) ? fs.readFileSync(projectIndexScssPath, 'utf8') : '';
      let componentIndexScssContent = fs.existsSync(componentIndexScssPath) ? fs.readFileSync(componentIndexScssPath, 'utf8') : '';
      let utilityIndexScssContent = fs.existsSync(utilityIndexScssPath) ? fs.readFileSync(utilityIndexScssPath, 'utf8') : '';

      $('*[class]').each(function () {
        const classes = $(this).attr('class').split(/\s+/); // HTML の要素からクラス名を取得
        classes.forEach(function (className) {
          let targetPath, indexScssContent;
          const baseClassName = className.split('__')[0]; // '__' が含まれている場合、それより前の部分を取得
          const scssClassName = `_${baseClassName}`; // SCSS ファイル名

          // クラス名の先頭文字に基づいて対応するフォルダと _index.scss の内容を選択
          if (className.startsWith('l')) {
            targetPath = 'src/assets/sass/layout';
            indexScssContent = layoutIndexScssContent;

          } else if (className.startsWith('p')) {
            targetPath = 'src/assets/sass/project';
            indexScssContent = projectIndexScssContent;

          } else if (className.startsWith('c')) {
            targetPath = 'src/assets/sass/component';
            indexScssContent = componentIndexScssContent;

          } else if (className.startsWith('u')) {
            targetPath = 'src/assets/sass/utility';
            indexScssContent = utilityIndexScssContent;

          } else {
            return; // その他のクラス名は無視
          }

          const scssFilePath = path.join(targetPath, scssClassName + '.scss'); // 対応する SCSS ファイルのパスを生成
          if (!fs.existsSync(scssFilePath)) {
            fs.writeFileSync(scssFilePath, `@use "../global" as *;\n\n.${baseClassName} {\n  \n}`); // SCSS ファイルが存在しない場合に新規作成
            indexScssContent += `@use "${baseClassName}";\n`; // 対応する _index.scss に新しい @use ステートメントを追加
          }

          // 更新された内容で _index.scss ファイルを書き込む
          if (className.startsWith('l')) {
            layoutIndexScssContent = indexScssContent;
          } else if (className.startsWith('p')) {
            projectIndexScssContent = indexScssContent;
          } else if (className.startsWith('c')) {
            componentIndexScssContent = indexScssContent;
          } else if (className.startsWith('u')) {
            utilityIndexScssContent = indexScssContent;
          }
        });
      });

      fs.writeFileSync(layoutIndexScssPath, layoutIndexScssContent); // layout の _index.scss を更新
      fs.writeFileSync(projectIndexScssPath, projectIndexScssContent); // project の _index.scss を更新
      fs.writeFileSync(componentIndexScssPath, componentIndexScssContent); // component の _index.scss を更新
      fs.writeFileSync(utilityIndexScssPath, utilityIndexScssContent); // utility の _index.scss を更新
    }));
});


// //ファイル削除のヘルパー関数

// //パスが存在するかどうかをチェックし、存在する場合はファイル/ディレクトリを削除
// gulp.task('deleteFolderRecursive', function (path) {
// // function deleteFolderRecursive(path) {
//    if(fs.existsSync(path)) {
//     //ディレクトリ内の各ファイル/ディレクトリに対して再帰的に処理を行う
//     fs.readdirSync(path).forEach(function(file) {
//       var curPath = path + "/" + file;
//     if(fs.lstatSync(curPath).isDirectory()) {
//       deleteFolderRecursive(curPath); //ディレクトリの場合は再帰的に処理を行う
//     }　else {
//       //ファイルを削除
//       fs.chmodSync(curPath,"0666"); //書き込み権限を設定
//       fs.unlinkSync(curPath); //ファイルを削除
//     }
//   });
//   //フォルダを削除
//   fs.chmodSync(path,"0777"); //書き込み権限を設定
//   fs.rmdirSync(path); //フォルダを削除
//    }
// });





exports.default = watch ;
exports.compileSass = compileSass ;
exports.browserInit = browserInit ;
exports.dev = gulp.parallel(browserInit,watch) ;
exports.minJS =minJS;
// exports.formatHTML =formatHTML;
// exports.build =gulp.parallel(formatHTML,minJS,compileSass,copyImage);