module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-shell');
    grunt.initConfig({
        shell: {
            notify_start: {
                command: 'notify-send -t 1000 "..." &'
            },
            notify_end: {
                command: 'notify-send -t 1000 -u critical "GRUNT: rebuilt"'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            all: {
                files: {
                    /* header */
                    'js/tmp/admin.js': 'js/src/admin.js',
                    'js/tmp/bugtracker.js': 'js/src/bugtracker.js',
                    'js/tmp/config.js': 'js/src/config.js',
                    'js/tmp/confirm.js': 'js/src/confirm.js',
                    'js/tmp/faq.js': 'js/src/faq.js',
                    'js/tmp/func.js': 'js/src/func.js',
                    'js/tmp/gettext.js': 'js/src/gettext.js',
                    'js/tmp/gui.js': 'js/src/gui.js',
                    'js/tmp/hideposts.js': 'js/src/hideposts.js',
                    'js/tmp/hknav.js': 'js/src/hknav.js',
                    'js/tmp/init.js': 'js/src/init.js',
                    'js/tmp/kusaba.js':'js/src/kusaba.js',
                    'js/tmp/nav.js': 'js/src/nav.js',
                    'js/tmp/post.js': 'js/src/post.js',
                    'js/tmp/settings.js': 'js/src/settings.js',
                    'js/tmp/stylewatcher.js': 'js/src/stylewatcher.js',
                    'js/tmp/jsonly.js': 'js/src/jsonly.js',
                    'js/tmp/sugar.js': 'js/src/sugar.js',
                    'js/tmp/update.js': 'js/src/update.js',
                    'js/tmp/youtube.js': 'js/src/youtube.js',
                    'js/tmp/frame.js': 'js/src/frame.js',
                    'js/tmp/main.js': 'js/src/main.js',
                    'js/tmp/menu.js': 'js/src/menu.js',
                    'js/tmp/bans.js': 'js/src/bans.js',
                }
            }
        },
        uglify: {
            default: {
                files: {
                    'js/min/boardpage.min.js': ['js/tmp/boardpage.js'],
                    'js/min/admin.min.js': ['js/tmp/admin.js'],
                    'js/min/bugtracker.min.js': ['js/tmp/bugtracker.js'],
                    'js/min/settings.min.js': ['js/tmp/settings.js'],
                    'js/min/confirm.min.js': ['js/tmp/confirm.js'],
                    'js/min/faq.min.js': ['js/tmp/faq.js'],
                    'js/min/menu.min.js': ['js/tmp/menu.js'],
                    'js/min/main.min.js': ['js/tmp/main.js'],
                    'js/min/frame.min.js': ['js/tmp/frame.js'],
                    'js/min/bans.min.js': ['js/tmp/bans.js'],
                }
            }
        },
        concat: {
            boardpage: {
                src: [
                /*'js/tmp/kusaba.js',*/
                'js/tmp/sugar.js',
                'js/tmp/func.js',
                'js/tmp/youtube.js',
                'js/tmp/nav.js',
                'js/tmp/update.js',
                'js/tmp/hideposts.js',
                'js/tmp/gui.js',
                'js/tmp/config.js',
                'js/tmp/gettext.js',
                'js/tmp/post.js',
                'js/tmp/confirm.js',
                'js/tmp/hknav.js',
                'js/tmp/stylewatcher.js',
                'js/tmp/init.js'
                ],
                dest: 'js/tmp/boardpage.js'
            },
            admin: {
                src: [
                    'js/tmp/admin.js',
                    'js/tmp/bugtracker.js'
                ],
                dest: 'js/tmp/admin.js'
            },
            settings: {
                src: [
                'js/tmp/sugar.js',
                'js/tmp/func.js',
                'js/tmp/gui.js',
                'js/tmp/config.js',
                'js/tmp/gettext.js',
                'js/tmp/settings.js',
                'js/tmp/stylewatcher.js',
                'js/tmp/jsonly.js',
                ],
                dest: 'js/tmp/settings.js'
            },
            faq: {
                src: [
                'js/tmp/sugar.js',
                'js/tmp/func.js',
                'js/tmp/config.js',
                'js/tmp/stylewatcher.js',
                'js/tmp/faq.js'
                ],
                dest: 'js/tmp/faq.js'
            },
            confirmation: {
                src: [
                'js/tmp/kusaba.js',
                'js/tmp/sugar.js',
                'js/tmp/func.js',
                'js/tmp/gui.js',
                'js/tmp/config.js',
                'js/tmp/gettext.js',
                'js/min/md5.min.js',
                'js/tmp/confirm.js',
                'js/tmp/stylewatcher.js',
                ],
                dest: 'js/tmp/confirm.js'
            },
            menu: {
                src: [
                'js/tmp/sugar.js',
                'js/tmp/func.js',
                'js/tmp/stylewatcher.js',
                'js/tmp/config.js',
                'js/tmp/menu.js',
                ],
                dest: 'js/tmp/menu.js'
            },
            main: {
                src: [
                'js/tmp/sugar.js',
                'js/tmp/func.js',
                'js/tmp/stylewatcher.js',
                'js/tmp/config.js',
                'js/tmp/main.js',
                ],
                dest: 'js/tmp/main.js'
            },
            frame: {
                src: [
                'js/tmp/sugar.js',
                'js/tmp/func.js',
                'js/tmp/stylewatcher.js',
                'js/tmp/config.js',
                'js/tmp/frame.js',
                ],
                dest: 'js/tmp/frame.js'
            },
            less_Muon:{
                src: [
                    'css/less/style/Muon.less',
                    'css/less/style.less'
                ],
                dest: 'css/tmp/Muon.less'
            },
            css_Muon:{
                src: [
                'css/tmp/Muon.css',
                'css/code/dark.css',
                'css/counter/dark.css',
                ],
                dest: 'css/style/Muon.css'
            },
            less_Neutron:{
                src: [
                    'css/less/style/Neutron.less',
                    'css/less/style.less'
                ],
                dest: 'css/tmp/Neutron.less'
            },
            css_Neutron:{
                src: [
                'css/tmp/Neutron.css',
                'css/code/dark.css',
                'css/counter/dark.css',
                ],
                dest: 'css/style/Neutron.css'
            },
            less_Futaba:{
                src: [
                    'css/less/style/Futaba.less',
                    'css/less/style.less'
                ],
                dest: 'css/tmp/Futaba.less'
            },
            css_Futaba:{
                src: [
                'css/tmp/Futaba.css',
                'css/code/light.css',
                'css/counter/light.css',
                ],
                dest: 'css/style/Futaba.css'
            },
            less_Burichan:{
                src: [
                    'css/less/style/Burichan.less',
                    'css/less/style.less'
                ],
                dest: 'css/tmp/Burichan.less'
            },
            css_Burichan:{
                src: [
                'css/tmp/Burichan.css',
                'css/code/light.css',
                'css/counter/light.css',
                ],
                dest: 'css/style/Burichan.css'
            },
            less_Photon:{
                src: [
                    'css/less/style/Photon.less',
                    'css/less/style.less'
                ],
                dest: 'css/tmp/Photon.less'
            },
            css_Photon:{
                src: [
                'css/tmp/Photon.css',
                'css/code/light.css',
                'css/counter/light.css',
                ],
                dest: 'css/style/Photon.css'
            },
            less_Gentoo:{
                src: [
                    'css/less/style/Gentoo.less',
                    'css/less/style.less'
                ],
                dest: 'css/tmp/Gentoo.less'
            },
            css_Gentoo:{
                src: [
                'css/tmp/Gentoo.css',
                'css/code/light.css',
                'css/counter/light.css',
                ],
                dest: 'css/style/Gentoo.css'
            },
        },
        less: {
            styles: {
                options: {
                    modifyVars: {
                        imgPath: '"http://a-chan.org/"',
                    }
                },
                files: {
                    'css/tmp/Muon.css': 'css/tmp/Muon.less',
                    'css/tmp/Neutron.css': 'css/tmp/Neutron.less',
                    'css/tmp/Futaba.css': 'css/tmp/Futaba.less',
                    'css/tmp/Burichan.css': 'css/tmp/Burichan.less',
                    'css/tmp/Photon.css': 'css/tmp/Photon.less',
                    'css/tmp/Gentoo.css': 'css/tmp/Gentoo.less',
                    'css/noscript.css': 'css/less/noscript.less',
                }
            },
        },
        grunticon: {
            myIcons: {
                files: [{
                    expand: true,
                    cwd: 'logo',
                    src: ['*.svg', '*.png'],
                    dest: "example/output"
                }],
                options: {
                }
            }
        },
        clean: {
            tmp: ['js/tmp/', 'css/tmp']
        },
    });
grunt.registerTask('styles', [
    'concat:less_Muon',
    'concat:less_Neutron',
    'concat:less_Futaba',
    'concat:less_Burichan',
    'concat:less_Photon',
    'concat:less_Gentoo',
    'less:styles',
    'concat:css_Muon',
    'concat:css_Neutron',
    'concat:css_Futaba',
    'concat:css_Burichan',
    'concat:css_Photon',
    'concat:css_Gentoo',
    'clean:tmp',
]);
grunt.registerTask('css', [
    'shell:notify_start',
    'styles',
    'shell:notify_end']);
grunt.registerTask('default', [
    'shell:notify_start',
    'babel',
    'concat:boardpage',
    'concat:admin',
    'concat:settings',
    'concat:confirmation',
    'concat:faq',
    'concat:menu',
    'concat:main',
    'concat:frame',
    'uglify:default',
    'styles',
    'clean:tmp',
    'shell:notify_end']);
};
