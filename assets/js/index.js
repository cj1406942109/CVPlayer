$(function() {

    var video = document.getElementById('video');

    var file = ''; //本地打开的视频文件
    var openCameraFlag = true; //是否打开摄像头
    var configTime = 0; //开始启动摄像头的时间
    var currentMedia = "video"; //当前播放资源为video

    var edit = false; //是否为可编辑状态
    var config = {};
    $('#saveBtn').click(function() {
        if (!edit) {
            $(this).text('保存').addClass('save');
            $('.setting-part input').removeAttr('disabled').addClass('editable');
            $('#hour').focus();
            edit = true;
        } else {
            $(this).text('设置').removeClass('save');
            $('.setting-part input').attr('disabled', true).removeClass('editable');
            config.hour = parseInt($('#hour').val());
            config.minute = parseInt($('#minute').val());
            config.second = parseInt($('#second').val());
            config.interval = parseInt($('#interval').val());
            configTime = config.hour * 3600 + config.minute * 60 + config.second;
            console.log(config);
            edit = false;
        }
    })

    //打开文件按钮点击事件
    $('#openBtn').click(function() {
        $("input[type='file']").click();
    });

    $("input[type='file']").change(function(e) {

        //显示菜单栏
        if ($("input[type='file']").val() != "") {
            $('.video-part').hover(function() {
                $('.fullscreen-part').stop().slideDown();
            }, function() {
                $('.fullscreen-part').stop().slideUp();
            })
        }

        $('.prompt').hide();
        $('#holder video').show();
        file = $("input[type='file']").prop('files')[0];
        console.log(file);
        $('#video').attr('src', file.path);
        video.play();

        //设置摄像头持续时间大于0时调用摄像头
        if (config.interval > 0) {
            // openCamera(video);

            var currentTime = 0;
            var lastTime = 0;
            setInterval(function() {

                //如果视频播放结束，则再次重新开始播放
                if (video.ended) {
                    // alert('ended');
                    video.play();
                    openCameraFlag = true;
                    currentTime = 0;
                }

                //如果播放资源为video，获取当前播放时间
                if (currentMedia == "video") {
                    currentTime = parseInt(video.currentTime);
                } else {
                    currentTime = configTime;
                }
                console.log("currentTime: " + currentTime);

                //如果当前播放资源为video
                if (currentMedia == "video") {

                    //如果本次尚未启动摄像头，并且播放时间达到设置的时间，则播放资源切换为camera
                    if (currentTime >= configTime && openCameraFlag) {
                        var p = navigator.mediaDevices.getUserMedia({
                            "video": true,
                            "audio": true
                        });
                        p.then(function(mediaStream) {
                            console.log("mediaStream:" + mediaStream);

                            video.src = window.URL.createObjectURL(mediaStream);
                            video.onloadedmetadata = function(e) {
                                video.play();
                            };
                        }).catch(function(err) {
                            console.log(err.name + ": " + err.message);
                        });
                        //设置播放资源为摄像头
                        currentMedia = "camera";
                        //本地播放已打开摄像头
                        openCameraFlag = false;
                    }


                } else if (currentMedia == "camera") { //当前播放资源为camera，计时器工作
                    lastTime++;
                    console.log(lastTime);
                    //如果摄像头启动时间达到设定时间，再次切换播放资源为"video"
                    if (lastTime >= config.interval) {
                        video.src = file.path;
                        video.currentTime = configTime;
                        currentMedia = "video";
                        lastTime = 0;
                    }
                }
            }, 1000);
        }
    });

    //全屏功能


    $('#closeBtn').hover(function() {
        $(this).find('img').attr('src', './assets/images/close_hover.png');
    }, function() {
        $(this).find('img').attr('src', './assets/images/close.png');
    })

    $('#closeBtn').click(function() {
        video.src = "";
        $("input[type='file']").val("");
        $('#holder video').hide();
        $('.prompt').show();
        $('.video-part').off('mouseenter').unbind('mouseleave');
        $('.fullscreen-part').hide();
    });
    $('#fullscreenBtn').hover(function() {
        $(this).find('img').attr('src', './assets/images/fullscreen_hover.png');
    }, function() {
        $(this).find('img').attr('src', './assets/images/fullscreen.png');
    });

});