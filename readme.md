# webbase-automated

This is a Grunt taskmanaged web project base with the following features
- __Sass__ and __Pug__ (formerly Jade) preprocessing
- automated __change detection__, __validation__, __autoprefixing__ and __browser-sync__
- __dev__ and __prod__ build distributions, including easy __prod__ build exclusions
- __prod__ distribution optimizations (minifying including sourcemaps)


## Installation
1. Install [npm](https://www.npmjs.com/)
2. Install [Grunt ](http://gruntjs.com), following the [getting started ](http://gruntjs.com/getting-started) instructions
3. Open the console, change to the projects working directory and install the projects dependencies with ```npm install```

## Usage

The following predefined tasks should now be available and executable via the console in the working directory

#### Trigger a dev distribution
```grunt build-dev``` wipes any existing development distribution and builds a new one under ```target/distDev/``` .

  - Every ```.sass``` file under ```assets/css/**/*``` is being linted, preprocessed and output to ```target/distDev/css/styles.css```

  - Every ```.pug``` file under ```assets/html/**/*``` is being linted, preprocessed
  and output to ```target/distDev/html/index.html```

  - Every ```.js``` file under ```assets/js/**/*``` is being linted, preprocessed
  and output to ```target/distDev/js/app.min.js```

  - Every file under ```assets/ressources/**/*``` is being copied to
  to ```target/distDev/ressources/```

the outputed filenames can easily be changed by renaming them in the ```Gruntfile.js```

```javascript
13    var targetHtmlFilename = '/index.html';
14    var targetJsFilename = '/app.min.js';
15    var targetCssFilename = '/styles.css';
```

#### Start local dev server and watch task
###### (e.g. validation, preprocessing, browser-sync etc.)
```grunt dev``` starts the ```grunt build-dev``` task, a local dev server and a watch task. The server runs on ```grunt-contrib-connect```s default port ```8000``` and operates on ```target/distDev/html/``` (the development distribution) as its base.

The watch task watches any file change (added, deleted, changed) in the ```assets/**/*/``` folder (aswell as the ```Gruntfile.js``` itself, this was for development purposes on the gruntfile) and executes a corresponding task for every file. E.g. linting, preprocessing and copying it to it's destination folder as defined in the ```grunt build-dev``` task.   
The distribution folder itself is also being watched, as it is the base for the dev connect server. Every change detected triggers the watch tasks livereload feature, which causes the browser to automatically refresh.


#### Trigger a prod distribution
```grunt build-prod``` wipes any existing production distribution and builds a new one under ```target/distProd/``` . Basically does the same as the ```grunt build-dev``` task but optimizes the output for a production ready build.

#### Start local prod server
```grunt prod``` starts a local server with the production distribution as its base. The server runs on ```grunt-contrib-connect```s default port ```8000``` and operates on ```target/distProd/html/``` as its base.

#### Start local dev server and watch task without a dev build
```grunt dev-server``` does exactly what the heading says

#### Excluding code from the prod distribution
Any code in ```.html, .js or .css``` can easily be excluded from the __prod__ build by wrapping the code in the ```@exclude``` directive as a comment.

Example in ```.pug``` which will be preprocessed to ```.html```:
```jade
doctype html
html
  head
  body
    include includes/template.pug

    //@exclude
    script(src="//localhost:35729/livereload.js")
    //@endexclude
```
Output for __dev__ distribution (with the script):
```html
<!DOCTYPE hmtl>
<html>
  <head></head>
  <body>
    <p>this is a paragraph in a template</p>
    <!--@exclude-->
    <script src="//localhost:35729/livereload.js"></script>
    <!--@endexclude-->
  </body>
</html>
```
Output for __prod__ distribution (without the script):
```html
<!DOCTYPE hmtl><html><head></head><body><p>this is a paragraph in a template</p></body></html>
```

## Configuration
###### Any further configuration or building on top of this can simply be done by editing the ```Gruntfile.js``` tasks. Documentation on how to configure them can be found [here](http://www.giyf.com/). Feel free to do as you wish with it, cheers ;)
