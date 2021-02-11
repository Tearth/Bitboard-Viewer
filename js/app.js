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
    
    $('#andBitboard3').click(andBitboard3Click);
    $('#orBitboard3').click(orBitboard3Click);
    $('#xorBitboard3').click(xorBitboard3Click);
});

function generateLayout(areaId, variant) {
    var area = $(areaId);
    for (var y = 0; y < 8; y++) {
        var row = $(document.createElement('div')).prop({
            class: 'layout-row'
        });
        
        for (var x = 0; x < 8; x++) {
            var value = getLayoutVariantByXY(variant, x, y);
            if (value < 10) {
                value = '0' + value;
            }
            
            var span = $(document.createElement('span')).html(value);
            row.append(span);
        }
        
        area.append(row);
    }
}

function getLayoutVariantByXY(variant, x, y) {
    switch (variant) {
        case 0: return 63 - (7 - x + y * 8);
        case 1: return 63 - (x + y * 8);
        case 2: return x + y * 8;
        case 3: return 7 - x + y * 8;
    }
    
    return 0;
}

function getLayoutVariantByIndex(variant, index) {
    return getLayoutVariantByXY(variant, index % 8, Math.floor(index / 8));
}

function generateBitboard(bitboard, readOnly) {
    var area = $(bitboard);
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
                checkbox.prop('readonly', true);
            }
            
            row.append(checkbox);
        }
        
        area.append(row);
    }
}

function decBitboard1KeyUp() {
    decKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'));
}

function hexBitboard1KeyUp() {
    hexKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'));
}

function binBitboard1KeyUp() {
    binKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'));
}

function decBitboard2KeyUp() {
    decKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'));
}

function hexBitboard2KeyUp() {
    hexKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'));
}

function binBitboard2KeyUp() {
    binKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'));
}

function andBitboard3Click() {
    var value1 = BigInt($('#decBitboard1').val());
    var value2 = BigInt($('#decBitboard2').val());
    var result = value1 & value2;
    
    updateReadOnlyTextboxes(result);
    updateBitboard($('#bitboard3'), result);
}

function orBitboard3Click() {
    var value1 = BigInt($('#decBitboard1').val());
    var value2 = BigInt($('#decBitboard2').val());
    var result = value1 | value2;
    
    updateReadOnlyTextboxes(result);
    updateBitboard($('#bitboard3'), result);
}

function xorBitboard3Click() {
    var value1 = BigInt($('#decBitboard1').val());
    var value2 = BigInt($('#decBitboard2').val());
    var result = value1 ^ value2;
    
    updateReadOnlyTextboxes(result);
    updateBitboard($('#bitboard3'), result);
}

function decKeyUp(bitboard, decTextbox, hexTextbox, binTextbox) {
    var bigIntValue = BigInt(decTextbox.val());
    hexTextbox.val('0x' + bigIntValue.toString(16));
    binTextbox.val('0b' + bigIntValue.toString(2));
    
    updateBitboard(bitboard, bigIntValue);
}

function hexKeyUp(bitboard, decTextbox, hexTextbox, binTextbox) {
    var bigIntValue = BigInt(hexTextbox.val());
    decTextbox.val(bigIntValue.toString(10));
    binTextbox.val('0b' + bigIntValue.toString(2));
    
    updateBitboard(bitboard, bigIntValue);
}

function binKeyUp(bitboard, decTextbox, hexTextbox, binTextbox) {
    var bigIntValue = BigInt(binTextbox.val());
    decTextbox.val(bigIntValue.toString(10));
    hexTextbox.val('0x' + bigIntValue.toString(16));
    
    updateBitboard(bitboard, bigIntValue);
}

function updateReadOnlyTextboxes(value) {
    $('#decBitboard3').val(value.toString(10));
    $('#hexBitboard3').val('0x' + value.toString(16));
    $('#binBitboard3').val(value.toString(2));
}

function updateBitboard(bitboard, value) {
    for (var index = 0; index < 64; index++) {
        var bit = value & BigInt(1);
        value = value >> BigInt(1);
        
        var bitboardIndex = getLayoutVariantByIndex(0, index);
        bitboard.find('input[type=checkbox][value=' + bitboardIndex + ']').prop('checked', bit != 0);
    }
}