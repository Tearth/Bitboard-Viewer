let layoutVariant = 0;

$(document).ready(function() {
    generateLayout($('#layout1'), 0);
    generateLayout($('#layout2'), 1);
    generateLayout($('#layout3'), 2);
    generateLayout($('#layout4'), 3);
    
    generateBitboard($('#bitboard1'), $('#decBitboard1'), false);
    generateBitboard($('#bitboard2'), $('#decBitboard2'), false);
    generateBitboard($('#bitboard3'), $('#decBitboard3'), true);
    
    var selectedLayoutCookie = Cookies.get('selectedLayout');
    if (selectedLayoutCookie != undefined) {
        layoutVariant = parseInt(selectedLayoutCookie);
    }
    
    $('#container').show();
    
    $('#layoutRadio1').click(() => changeLayout(0));
    $('#layoutRadio2').click(() => changeLayout(1));
    $('#layoutRadio3').click(() => changeLayout(2));
    $('#layoutRadio4').click(() => changeLayout(3));
    
    $('#decBitboard1').keyup(() => decKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1')));
    $('#hexBitboard1').keyup(() => hexKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1')));
    $('#binBitboard1').keyup(() => binKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1')));
    
    $('#decBitboard2').keyup(() => decKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2')));
    $('#hexBitboard2').keyup(() => hexKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2')));
    $('#binBitboard2').keyup(() => binKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2')));
    
    $('#fillBitboard1').click(() => fillBitboard($('#decBitboard1')));
    $('#fillBitboard2').click(() => fillBitboard($('#decBitboard2')));
    
    $('#clearBitboard1').click(() => clearBitboard($('#decBitboard1')));
    $('#clearBitboard2').click(() => clearBitboard($('#decBitboard2')));
    
    $('#shlBitboard1').click(() => shlBitboard($('#decBitboard1')));
    $('#shlBitboard2').click(() => shlBitboard($('#decBitboard2')));
    
    $('#shrBitboard1').click(() => shrBitboard($('#decBitboard1')));
    $('#shrBitboard2').click(() => shrBitboard($('#decBitboard2')));
    
    $('#notBitboard1').click(() => notBitboard($('#decBitboard1')));
    $('#notBitboard2').click(() => notBitboard($('#decBitboard2')));
    
    $('#andBitboard3').click(() => doOperation((x, y) => x & y));
    $('#orBitboard3').click(() => doOperation((x, y) => x | y));
    $('#xorBitboard3').click(() => doOperation((x, y) => x ^ y));
});

function generateLayout(layout, variant) {
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
        
        layout.append(row);
    }
}

function generateBitboard(bitboard, decTextbox, readOnly) {
    for (var y = 0; y < 8; y++) {
        var row = $(document.createElement('div')).prop({
            class: 'bitboard-row'
        });
        
        for (var x = 0; x < 8; x++) {
            var value = x + y * 8;
            var checkbox = $(document.createElement('input')).prop({
                type: 'checkbox',
                value: value,
            });
            
            if (readOnly) {
                checkbox.prop('readonly', true);
            }
            
            checkbox.click(((v) => () => bitboardCheckboxClick(bitboard, decTextbox, v))(value));
            row.append(checkbox);
        }
        
        bitboard.append(row);
    }
}

function changeLayout(variant) {
    layoutVariant = variant;
    refreshValuesAfterLayoutChange();
    
    Cookies.set('selectedLayout', variant, { expires: 10 * 365 });
}

function refreshValuesAfterLayoutChange() {
    decKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'));
    decKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'));
    decKeyUp($('#bitboard3'), $('#decBitboard3'), $('#hexBitboard3'), $('#binBitboard3'));
}

function doOperation(operation) {
    var value1 = BigInt($('#decBitboard1').val());
    var value2 = BigInt($('#decBitboard2').val());
    var result = operation(value1, value2);
    
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
    $('#binBitboard3').val('0b' + value.toString(2));
}

function updateBitboard(bitboard, value) {
    for (var index = 0; index < 64; index++) {
        var bit = value & 1n;
        value = value >> 1n;
        
        var bitboardIndex = getLayoutVariantByIndex(layoutVariant, index);
        bitboard.find('input[type=checkbox][value=' + bitboardIndex + ']').prop('checked', bit != 0);
    }
}

function bitboardCheckboxClick(bitboard, decTextbox, index) {
    var checkbox = bitboard.find('input[type=checkbox][value=' + index + ']');
    var state = checkbox.prop('checked');
    var variantIndex = BigInt(getLayoutVariantByIndex(layoutVariant, index));
    
    var value = BigInt(decTextbox.val());
    value = (value & ~(1n << variantIndex)) | (BigInt(state ? 1 : 0) << variantIndex);
    
    decTextbox.val(value);
    refreshValuesAfterLayoutChange();
}

function fillBitboard(decTextbox) {
    decTextbox.val('18446744073709551615');
    refreshValuesAfterLayoutChange();
}

function clearBitboard(decTextbox) {
    decTextbox.val('0');
    refreshValuesAfterLayoutChange();
}

function shlBitboard(decTextbox) {
    var value = BigInt(decTextbox.val());
    value = value << 1n;
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
}

function shrBitboard(decTextbox) {
    var value = BigInt(decTextbox.val());
    value = value >> 1n & ~(1n << 63n);
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
}

function notBitboard(decTextbox) {
    var value = BigInt(decTextbox.val());
    value = 18446744073709551615n - value - 1n;
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
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