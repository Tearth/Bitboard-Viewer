$(document).ready(function() {
    generateBitboard('#bitboard1', false);
    generateBitboard('#bitboard2', false);
    generateBitboard('#bitboard3', true);
});

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
    
    
    if (readOnly) {
        area.append(generateGroupOfButtons(true));
    } else {
        area.append(generateGroupOfButtons(false));
        area.append(generateTextbox('Decimal'));
        area.append(generateTextbox('Hexadecimal'));
        area.append(generateTextbox('Binary'));
    }
}

function generateTextbox(label) {
    var div = $(document.createElement('div')).prop({
        class: 'input-row'
    });
    
    var textbox = $(document.createElement('input')).prop({
        type: 'textbox',
        class: 'form-control',
        placeholder: label
    });
    
    div.append(textbox);
    return div;
}

function generateGroupOfButtons(readOnly) {
    var group = $(document.createElement('div')).prop({
        class: 'btn-group buttons-row'
    });
    
    if (readOnly) {
        group.append(generateButton('AND'));
        group.append(generateButton('OR'));
        group.append(generateButton('XOR'));
        group.append(generateButton('NOT'));
    } else {
        group.append(generateButton('Fill'));
        group.append(generateButton('Clear'));
        group.append(generateButton('Shift left'));
        group.append(generateButton('Shift right'));
    }
    
    return group;
}

function generateButton(value) {
    return $(document.createElement('input')).prop({
        type: 'button',
        class: 'btn btn-info',
        value: value
    });
}