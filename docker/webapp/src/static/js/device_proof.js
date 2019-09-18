$(function(){
    let pro_name = $('#pro_name').text();
    let dev_id = $('#cur_device_id').text();

    let ocr_param_text = $('#dev_ocr_param').text();
    let ocr_param_json = {};
    let ocr_param_rects = [];
    if (ocr_param_text) {
        ocr_param_json = JSON.parse(ocr_param_text);
    }
    let img_url = $('#proof_img_url').text();

    let width = 0;
    let height = 0;
    if (img_url && img_url.length > 0) {
        width = 468;
        height = 176;
    }
    // create a stage for the element whose id is 'container'
    let stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });
    const image_fix_width = 468;
    const rect_max_size = 120;
    const rect_min_size = 20;
    let scale_rate = 1;
    let layer = new Konva.Layer();
    let transformer = null;
    stage.add(layer);
    $('#container').width(image_fix_width);

    let imageObj  = new Image();
    imageObj.onload = function() {
        scale_rate = image_fix_width / imageObj.width;
        let img = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
            width: image_fix_width,
            height: imageObj.height * scale_rate,
        });
        layer.add(img);
        layer.draw();
        stage.width(image_fix_width);
        stage.height(imageObj.height * scale_rate);

        // update table
        ocr_param_rects = [];
        if (ocr_param_json['rects']) {
            ocr_param_rects = ocr_param_json['rects'].slice(0);
            $.each(ocr_param_rects, function(i, value) {
                let loc_x = value[0] * scale_rate;
                let loc_y = value[1] * scale_rate;
                let loc_w = value[2] * scale_rate - loc_x;
                let loc_h = value[3] * scale_rate - loc_y;
                if (loc_x > 0 && loc_y > 0) {
                    addRect(loc_x, loc_y, loc_w, loc_h);
                }
            });
            update_labels_table();
        } else {
            if (img_url && img_url.length > 0) {
                get_rects_from_server();
            }
        }
    };


    if (img_url && img_url.length > 0) {
        imageObj.src = img_url;
        stage.find('Rect').destroy();
        destroyTransformer();
    }

    function update_labels_table() {
        // empty elements
        $("#labels-table tbody").empty();

        // add new rows
        let table_body = '';
        $.each(ocr_param_rects, function(i, value) {
            if(value[0] > 0) {
                table_body += '<tr><td>' + (i + 1) + '</td>';
                for (let n = 0; n < 4; n++) {
                    table_body += '<td>' + value[n] + '</td>';
                }
                table_body += '</tr>';
            }
        });

        if (table_body) {
            $("#labels-table tbody").append(table_body);
        }
    }

    function update_ocr_param_rects() {
        ocr_param_rects = [];
        let rects = stage.find('.rect');
        $.each(rects, function(i, element) {
            let real_lx = Math.round(element.x()/scale_rate);
            let real_ly = Math.round(element.y()/scale_rate);
            let real_rx = Math.round(real_lx + element.width()*element.scaleX()/scale_rate);
            let real_ry = Math.round(real_ly + element.height()*element.scaleY()/scale_rate);
            ocr_param_rects.push([real_lx, real_ly, real_rx, real_ry]);
        });
        ocr_param_rects.sort(function(x, y){return x[0] - y[0]});
    }

    function addRect(x, y, width, height) {
        let rect = new Konva.Rect({
            x: x,
            y: y,
            width: width,
            height: height,
            fill: 'green',
            opacity: 0.5,
            stroke: 'black',
            name: 'rect',
            draggable: true,
        });

        rect.on('transformend dragend', function(e) {
            console.log("transformend dragend");
            if (e.target.name().substring(0, 4) === "rect") {
                update_ocr_param_rects();
                update_labels_table();
            }
        });
        rect.on('dblclick dbltap', function(e) {
            let current = e.target;
            current.destroy();
            destroyTransformer();
            layer.draw();

            // update rectangles params
            update_ocr_param_rects();
            update_labels_table();
        });

        layer.add(rect);
        layer.draw();

        return rect;
    }

    function setMousePosition(e) {
        let pointer_position = stage.getPointerPosition();
        mouse.x = pointer_position.x;
        mouse.y = pointer_position.y;
    }

    function destroyTransformer() {
        if (transformer) {
            transformer.destroy();
            transformer = null;
        }
    }

    let mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    let element = null;

    stage.on('mousemove touchmove', function(e) {
        setMousePosition(e);
        if (element !== null) {
            let new_width = Math.abs(mouse.x - mouse.startX);
            let new_height = Math.abs(mouse.y - mouse.startY);
            new_width = new_width > rect_max_size ? rect_max_size : new_width;
            new_height = new_height > rect_max_size ? rect_max_size : new_height;
            element.setAttr('width', new_width);
            element.setAttr('height', new_height);
            element.setAttr('x', (mouse.x - mouse.startX < 0) ? mouse.x : mouse.startX);
            element.setAttr('y', (mouse.y - mouse.startY < 0) ? mouse.y : mouse.startY);
            layer.draw();
        }
    });

    $('#container').on('mouseleave', function() {
        if (element !== null) {
            element.destroy();
            element = null;
            layer.draw();
            stage.container().style.cursor = 'default';
            console.log('canceled.');
        }
    });

    stage.on('mousedown touchstart', function(e) {
        setMousePosition(e);

        // begin drawing rectangle
        if (e.target.name().substring(0, 4) !== "rect") {
            if (transformer && transformer.isTransforming()) {
                return;
            }
            console.log('begun.');
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            element = addRect(mouse.x, mouse.y, 0, 0);
            layer.draw();
            stage.container().style.cursor = 'crosshair';
        }
    });

    stage.on('mouseup touchend', function(e) {
        setMousePosition(e);
        if (element !== null) {
            if (Math.abs(mouse.x - mouse.startX) < rect_min_size || Math.abs(mouse.y - mouse.startY) < rect_min_size) {
                element.destroy();
                destroyTransformer();
            } else {
                update_ocr_param_rects();
                update_labels_table();
            }

            element = null;
            layer.draw();
            stage.container().style.cursor = 'default';
            console.log('finished.');
        }
    });

    stage.on('click tap', function(e) {
        setMousePosition(e);

        // remove old transformers
        destroyTransformer();

        // create new transformer
        if (e.target.name().substring(0, 4) === "rect") {
            transformer = new Konva.Transformer({
                boundBoxFunc: function(oldBoundBox, newBoundBox) {
                    let abs_w = Math.abs(newBoundBox.width);
                    let abs_h = Math.abs(newBoundBox.height);
                    if (abs_w > rect_max_size || abs_h > rect_max_size || abs_w < rect_min_size || abs_h < rect_min_size) {
                        return oldBoundBox;
                    }

                    return newBoundBox;
                }
            });
            layer.add(transformer);
            transformer.attachTo(e.target);
        }
        layer.draw();
    });

    $('#btn-lang-en').on('click', function(){
        $.get(pro_name+'/lang/e', function(data){
            console.log('set lang to english: ', data.msg);
            location.reload();
        });
    });
    $('#btn-lang-ja').on('click', function(){
        $.get(pro_name+'/lang/ja', function(data){
            console.log('set lang to japan: ', data.msg);
            location.reload();
        });
    });

    $('.wrapper').on('click', '.meter-img', function(e){
        e.preventDefault();
        let img_url = $(this).data('img-url');
        $('#modal-img').attr('src', img_url);
        $('#info-modal').modal({
            'show': true
        });
    });

    $('.wrapper').on('click', '#btn-refresh', function(e){
        e.preventDefault();
        location.reload();
    });
    $('.wrapper').on('click', '#btn-back', function(e){
        e.preventDefault();
        location.href = pro_name+'/render/devices';
    });
    $('.wrapper').on('click', '.btn-device-detect-rect', function(e){
        e.preventDefault();
        get_rects_from_server();
    });

    function get_rects_from_server() {
        let filename = imageObj.src.substring(imageObj.src.lastIndexOf('/') + 1);
        $.get(pro_name+'/api/detect?filename='+filename, function(result) {
            ocr_param_rects = [];
            stage.find('Rect').destroy();
            destroyTransformer();
            if (result.code == 0) {
                let rect_data = result.data;
                if (rect_data.length > 0) {
                    rect_data.forEach(function(ele) {
                        console.log(ele)
                        let value = ele['bounding_box'];
                        let ele_x = Math.round(value['x_min']);
                        let ele_y = Math.round(value['y_min']);
                        let ele_w = Math.round(value['width']);
                        let ele_h = Math.round(value['height']);
                        let loc_x = Math.round(ele_x * scale_rate);
                        let loc_y = Math.round(ele_y * scale_rate);
                        let loc_w = Math.round(ele_w * scale_rate);
                        let loc_h = Math.round(ele_h * scale_rate);
                        ocr_param_rects.push([ele_x, ele_y, ele_x + ele_w, ele_y + ele_h]);
                        addRect(loc_x, loc_y, loc_w, loc_h);
                    });
                    ocr_param_rects.sort(function(x, y){return x[0] - y[0]});
                }
            }
            update_labels_table();
        });
    }

    $('.wrapper').on('click', '.btn-device-update-params', function(e) {
        e.preventDefault();
        ocr_param_json['rects'] = ocr_param_rects;

        let http_method = 'PUT';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/device/'+dev_id+'/ocr_param_axis',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(ocr_param_json),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    $('#detect-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "success");
                } else {
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {

            }
        });
    });

    $('.wrapper').on('click', '.btn-cancel', function(e) {
        e.preventDefault();
        stage.find('Rect').destroy();
        destroyTransformer();
        ocr_param_rects = [];
        if (ocr_param_json['rects']) {
            ocr_param_rects = ocr_param_json['rects'].slice(0);
            $.each(ocr_param_rects, function(i, value) {
                let loc_x = value[0] * scale_rate;
                let loc_y = value[1] * scale_rate;
                let loc_w = value[2] * scale_rate - loc_x;
                let loc_h = value[3] * scale_rate - loc_y;
                if (loc_x > 0 && loc_y > 0) {
                    addRect(loc_x, loc_y, loc_w, loc_h);
                }
            });
        }
        update_labels_table();
    });

    setInterval(function () {
        $.get(pro_name+'/api/device/'+dev_id+'/proof', function (data) {
            if (data.code == 0) {
                if (img_url && img_url.length == 0 && data.data.img_url && data.data.img_url.length > 0) {
                    location.href = pro_name+'/render/device/'+dev_id+'/proof';
                }
                else if (!img_url.endsWith(data.data.img_url)) {
                    location.href = pro_name+'/render/device/'+dev_id+'/proof';
                }
            }
        });
    }, 1000 * 10);
});