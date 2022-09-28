let selectedLayout = 1;

$(document).ready(function() {
    generateLayout($('#layout1'), 1);
    generateLayout($('#layout2'), 2);
    generateLayout($('#layout3'), 3);
    generateLayout($('#layout4'), 4);
    
    generateBitboard($('#bitboard1'), $('#decBitboard1'), false);
    generateBitboard($('#bitboard2'), $('#decBitboard2'), false);
    generateBitboard($('#bitboard3'), $('#decBitboard3'), true);
    
    loadCookies();   
    $('#container').show();
    
    $('#layoutRadio1').click(() => changeLayout(1));
    $('#layoutRadio2').click(() => changeLayout(2));
    $('#layoutRadio3').click(() => changeLayout(3));
    $('#layoutRadio4').click(() => changeLayout(4));
    
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
            var value = getselectedLayoutByXY(variant, x, y);
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
	// Add bottom div for column buttons
	if (!readOnly) {
		var bottomrow = $(document.createElement('div')).prop({
			class: 'bitboard-row'
		});
	}
	
	for (var y = 0; y < 8; y++) {
		var row = $(document.createElement('div')).prop({
			class: 'bitboard-row',
		});
		
		// Add buttons to fill a row
		if (!readOnly){
			var rowbutton = $(document.createElement('button')).prop({
				type: 'rowbutton',
				value: y,
				id: y,
				class: "btn btn-primary",
			});
			
			rowbutton.click(((v) => () => rowClick(bitboard, decTextbox, v))(y))
		}
		
		// Buttons to fill columns
		const files =  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
		if (!readOnly) {
			var colbutton = $(document.createElement('button')).prop({
				type: 'colbutton',
				value: files[y],
				id: y,
				class: "btn btn-primary",
				style: y == 0 ? "margin-left: 22px" : ""
			});
			
			colbutton.click(((v) => () => colClick(bitboard, decTextbox, v))(files[y]))
		}
		
		// Checkboxes
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
			
			if (!readOnly) {
				row.prepend(rowbutton);
			}
				
			if (!readOnly) {
				bottomrow.append(colbutton);
			}
			
			row.append(checkbox);
		}
		
		bitboard.append(row);
		
		if (!readOnly) {
			bitboard.append(bottomrow)
		};

	}
	
	if (readOnly){
		var colspacer = $(document.createElement('div')).prop({
			class: 'colspacer'
		});
		bitboard.append(colspacer)
    }
}

function loadCookies() {
    var selectedLayoutCookie = Cookies.get('selectedLayout');
    if (selectedLayoutCookie != undefined) {
        selectedLayout = parseInt(selectedLayoutCookie);
        $('#layoutRadio' + selectedLayoutCookie).prop('checked', true);
    }
    else {
        $('#layoutRadio1').prop('checked', true);
    }
}

function changeLayout(variant) {
    selectedLayout = variant;
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
        
        var bitboardIndex = getselectedLayoutByIndex(selectedLayout, index);
        bitboard.find('input[type=checkbox][value=' + bitboardIndex + ']').prop('checked', bit != 0);
    }
}

function bitboardCheckboxClick(bitboard, decTextbox, index) {
    var checkbox = bitboard.find('input[type=checkbox][value=' + index + ']');
    var state = checkbox.prop('checked');
    var variantIndex = BigInt(getselectedLayoutByIndex(selectedLayout, index));
    var value = BigInt(decTextbox.val());
    value = (value & ~(1n << variantIndex)) | (BigInt(state ? 1 : 0) << variantIndex);
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
}

function rowClick(bitboard, decTextbox, rank){
    // Magic number is a fully filled 8th rank
    var toprow = 18374686479671623680n;
    // Inverse the shiftvalue for different layouts
    var shiftval = BigInt(calcRowShiftValue(selectedLayout, rank));
    var row = toprow >> (shiftval * 8n);
    // OR the existing field and the newly filled row
    var newvalue = BigInt(decTextbox.val()) | row;
    decTextbox.val(newvalue);
    
    refreshValuesAfterLayoutChange();
}

function colClick(bitboard, decTextbox, file){
    const files =  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    file = BigInt(files.indexOf(file));
    // Magic number is a fully filled H file
    var rightcol = 9259542123273814144n;
    // Inverse the shiftvalue for different layouts
    var shiftval = calcColShiftValue(selectedLayout, 7n - file);
    var col =  rightcol >> shiftval;
    // OR the existing field and the newly filled col
    var newvalue = BigInt(decTextbox.val()) | col;
    decTextbox.val(newvalue);

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
    value = 18446744073709551615n - value;
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
}

function getselectedLayoutByXY(variant, x, y) {
    switch (variant) {
        case 1: return 63 - (7 - x + y * 8);
        case 2: return 63 - (x + y * 8);
        case 3: return x + y * 8;
        case 4: return 7 - x + y * 8;
    }
    
    return 0;
}

function getselectedLayoutByIndex(variant, index) {
    return getselectedLayoutByXY(variant, index % 8, Math.floor(index / 8));
}

function calcRowShiftValue(variant, value) {
    switch (variant) {
        case 1: return value;
        case 2: return value;
        case 3: return 7 - value;
        case 4: return 7 - value;
    }
}

function calcColShiftValue(variant, value) {
    switch (variant) {
        case 1: return value;
        case 2: return 7n - value;
        case 3: return value;
        case 4: return 7n - value;
    }
}