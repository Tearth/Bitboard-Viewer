$(document).ready(function() {
    generateBitboard("#bitboard1");
    generateBitboard("#bitboard2");
    generateBitboard("#bitboard3");
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
}