$(document).ready(function() {
    generateLayout('#layout1', 0);
    generateLayout('#layout2', 1);
    generateLayout('#layout3', 2);
    generateLayout('#layout4', 3);
    
    generateBitboard('#bitboard1', false);
    generateBitboard('#bitboard2', false);
    generateBitboard('#bitboard3', true);
    
    $('#decBitboard1').keyup(decBitboard1KeyUp);
    $('#hexBitboard1').keyup(hexBitboard1KeyUp);
    $('#binBitboard1').keyup(binBitboard1KeyUp);
    
    $('#decBitboard2').keyup(decBitboard2KeyUp);
    $('#hexBitboard2').keyup(hexBitboard2KeyUp);
    $('#binBitboard2').keyup(binBitboard2KeyUp);
});

function generateLayout(areaId, variant) {
    var area = $(areaId);
    for (var y = 0; y < 8; y++) {
        var row = $(document.createElement('div')).prop({
            class: 'layout-row'
        });
        
        for (var x = 0; x < 8; x++) {
            var value = getLayoutVariant(variant, x, y);
            if (value < 10) {
                value = '0' + value;
            }
            
            var span = $(document.createElement('span')).html(value);
            row.append(span);
        }
        
        area.append(row);
    }
}

function getLayoutVariant(variant, x, y) {
    switch (variant) {
        case 0: return 63 - (7 - x + y * 8);
        case 1: return 63 - (x + y * 8);
        case 2: return x + y * 8;
        case 3: return 7 - x + y * 8;
    }
    
    return 0;
}

function generateBitboard(areaId, readOnly) {
    var area = $(areaId);
    for (var y = 0; y < 8; y++) {
        var row = $(document.createElement('div')).prop({
            class: 'bitboard-row'
        });
        
        for (var x = 0; x < 8; x++) {
            var checkbox = $(document.createElement('input')).prop({
                type: 'checkbox',
                value: x + y * 8,
            });
            
            if (readOnly) {
                checkbox.prop('disabled', true);
            }
            
            row.append(checkbox);
        }
        
        area.append(row);
    }
}

function decBitboard1KeyUp() {
    decKeyUp($('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'));
}

function hexBitboard1KeyUp() {
    hexKeyUp($('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'));
}

function binBitboard1KeyUp() {
    binKeyUp($('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'));
}

function decBitboard2KeyUp() {
    decKeyUp($('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'));
}

function hexBitboard2KeyUp() {
    hexKeyUp($('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'));
}

function binBitboard2KeyUp() {
    binKeyUp($('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'));
}

function andBitboard3Click() {
    
}

function orBitboard3Click() {
    
}

function xorBitboard3Click() {
    
}

function decKeyUp(decTextbox, hexTextbox, binTextbox) {
    var value = parseInt(decTextbox.val(), 10);
    hexTextbox.val('0x' + value.toString(16));
    binTextbox.val(value.toString(2));
}

function hexKeyUp(decTextbox, hexTextbox, binTextbox) {
    var value = parseInt(hexTextbox.val(), 16);
    decTextbox.val(value.toString(10));
    binTextbox.val(value.toString(2));
}

function binKeyUp(decTextbox, hexTextbox, binTextbox) {
    var value = parseInt(binTextbox.val(), 2);
    decTextbox.val(value.toString(10));
    hexTextbox.val('0x' + value.toString(16));
}