$(document).ready(function() {
    generateBitboard('#bitboard1');
    generateBitboard('#bitboard2');
    generateBitboard('#bitboard3');
});

function generateBitboard(areaId) {
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
            row.append(checkbox);
        }
        
        area.append(row);
    }
    
    area.append(generateTextbox('Decimal'));
    area.append(generateTextbox('Hexadecimal'));
    area.append(generateGroupOfButtons());
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

function generateGroupOfButtons() {
    var group = $(document.createElement('div')).prop({
        class: 'btn-group buttons-row'
    });
    
    group.append(generateButton('Fill'));
    group.append(generateButton('Clear'));
    group.append(generateButton('Shift left'));
    group.append(generateButton('Shift right'));
    return group;
}

function generateButton(value) {
    return $(document.createElement('input')).prop({
        type: 'button',
        class: 'btn btn-info',
        value: value
    });
}