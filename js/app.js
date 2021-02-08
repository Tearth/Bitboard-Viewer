$(document).ready(function() {
    generateLayout('#layout1', 0);
    generateLayout('#layout2', 1);
    generateLayout('#layout3', 2);
    generateLayout('#layout4', 3);
    
    generateBitboard('#bitboard1', false);
    generateBitboard('#bitboard2', false);
    generateBitboard('#bitboard3', true);
});

function generateLayout(areaId, variant) {
    var area = $(areaId);
    
    var radioRow = $(document.createElement('div')).prop({
        class: 'radio-row'
    });
    
    var radio = $(document.createElement('input')).prop({
        type: 'radio',
        name: 'radioLayout',
        class: 'form-check-input',
        value: variant
    });
    
    var radioLabel = $(document.createElement('label')).prop({
        class: 'form-check-label'
    }).html('test');
    
    radioRow.append(radio);
    radioRow.append(radioLabel);
    area.append(radioRow);
    
    for (var y = 0; y < 8; y++) {
        var row = $(document.createElement('div')).prop({
            class: 'layout-row'
        });
        
        for (var x = 0; x < 8; x++) {
            var value = getLayoutVariant(variant, x, y);
            if (value < 10) {
                value = "0" + value;
            }
            
            var span = $(document.createElement('span')).html(value);
            row.append(span);
        }
        
        area.append(row);
    }
}

function getLayoutVariant(variant, x, y) {
    switch (variant) {
        case 0: return 63 - (x + y * 8);
        case 1: return 63 - (7 - x + y * 8);
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