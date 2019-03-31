//  套件定義
//  在package.json內引用的套件
//  npm install gulp --global

//  gulp / yarn run gulp


const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del');




//  ============================================================
//          工作 1 建構SASS Compiler
//  ============================================================
const paths = {
    html:{
        src:'./*.html',
    },
    styles:{
        src:'./src/styles/index.scss',
        watch:'./src/styles/**/*.scss',
        dest:'build/css'
    },
    images:{
        src:'src/images/*',
        dest:'build/images'
    },
    webfonts:{
        src:'./src/fonts/*',
        dest:'build/font'
    },
    csssprite:{
        src:'src/sprite/*.png',
        dest:'build'
    },
    script:{
        src:'src/app/index.js',
        dest:'build/js'
    },
    venders:{
        script:{
            src:[
                'src/vender/jquery/dist/jquery-3.3.1.js',
                'src/vender/slider-pro/dist/js/jquery.slider-pro.min.js',
                'src/vender/magnific-popup/jquery.magnific-popup.min.js',
            ],
            dest:'build/js'
        },
        styles:{
            src:[
                'src/vender/slider-pro/dist/css/sliderPro.min.css',
                'src/vender/magnific-popup/dist/magnific-popup.css',
            ],
            dest:'build/css'
        },
        images:{
            src:[
                'src/vender/**/*.gif',
                'src/vender/**/*.jpg',
                'src/vender/**/*.png',
                'src/vender/**/*.cur'
            ],
            dest:'build/images'
        }
    }
};

const clean =() => del (['assets']);

const buildHtml = async function(cb){
    console.log('buildHtml');
    gulp.src(paths.html.src)
        .pipe(connect.reload());
    cb();
}

const buildSass = async function(cb){
    console.log('buildSass');
    gulp.src(paths.styles.src)
        .pipe(gulpSass())
        .pipe(gulp.dest(paths.styles.dest))
		.pipe(connect.reload());
    cb();
}

const compressImage = async function(cb){
    console.log('compressImage');
    gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(connect.reload());
    cb();
}

const webFont = async function(cb){
    console.log('webFont');
    gulp.src(paths.webfonts.src)
        .pipe(gulp.dest(paths.webfonts.dest))
        .pipe(connect.reload());
    cb();
}

const CSSSprite = async function(cb){
    console.log('CSSSprite');
    gulp.src(paths.csssprite.src).pipe(spritesmith({
    	imgName:'sprite.png',
    	cssName:'sprite.css'
    }))      
        .pipe(gulp.dest(paths.csssprite.dest))
        .pipe(connect.reload());
    cb();
}

const buildScript = async function(cb){
    console.log('buildScript');
    gulp.src(paths.script.src)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.script.dest))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest(paths.script.dest))
        .pipe(connect.reload());
    cb();
};

const venderJS = async function(cb){
    console.log('venderJS');
    gulp.src(paths.venders.script.src)
        .pipe(concat('venders.js'))
        .pipe(gulp.dest(paths.venders.script.dest))
        .pipe(rename('venders.min.js'))
        
        .pipe(gulp.dest(paths.venders.script.dest))
        .pipe(connect.reload());
    cb();

};

const venderCSS = async function(cb){
    console.log('venderCss');
    gulp.src(paths.venders.styles.src)
        .pipe(concat('venders.css'))
        .pipe(gulp.dest(paths.venders.script.dest))
        .pipe(rename('venders.min.js'))
        .pipe(gulp.dest(paths.venders.script.dest))
        .pipe(connect.reload());
    cb();

};

const venderImage = async function(cb){
    console.log('compressImage');
    gulp.src(paths.venders.images.src)
        .pipe(concat('venders.css'))
        .pipe(gulp.dest(paths.venders.images.dest))
        .pipe(connect.reload());
    cb();

};

const buildAssets = gulp.series(buildHtml,buildScript,buildSass,gulp.parallel(compressImage,webFont,CSSSprite));
const buildVenders = gulp.series(venderJS ,gulp.parallel(venderCSS,venderImage));

const watchFiles = async function(){
    gulp.watch(paths.html.src, buildHtml);
    gulp.watch(paths.styles.src, buildSass);
    gulp.watch(paths.images.src, compressImage);
    gulp.watch(paths.webfonts.src, webFont);
    gulp.watch(paths.csssprite.src, CSSSprite);
    gulp.watch(paths.script.src, buildScript);
    gulp.watch(paths.venders.script.src,venderJS);
    gulp.watch(paths.venders.styles.src,venderCSS);
    gulp.watch(paths.venders.images.src,venderImage);
}

const webServer = async function(){
	console.log('start server');
	connect.server({
		livereload: true
	});
}


/*
 events: 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error', 'all
 */


// gulp.watch('src/**/*.scss', { events: 'all' }, function(cb){
//     console.log('change SASS');
//     buildSass(cb);
//     cb();
// });


//exports.default = buildSass;
exports.default = gulp.series(clean,gulp.parallel(buildAssets,buildVenders),webServer,watchFiles);
//exports.default = gulp.parallel(buildSass,webServer);