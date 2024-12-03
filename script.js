const puzzleContainer = document.getElementById('puzzle-container');
const shuffleButton = document.getElementById('shuffle');
let tiles = [];
let emptyTileIndex = 8;  // Empty tile is at index 8 (last)
const gridSize = 3; // 3x3 grid (for 9 tiles)
const tileSize = 100; // 100px per tile
const imageSrc = "taj.jpg";

// Initialize the puzzle
function initPuzzle() {
    tiles = createImageTiles(imageSrc);
    emptyTileIndex = tiles.length - 1; // The empty tile starts at the last index (index 8)
    renderPuzzle();
}

// Create image tiles by dividing the image into smaller parts
function createImageTiles(imageSrc) {
    const tiles = [];

    for (let i = 0; i < gridSize * gridSize - 1; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        tiles.push({
            index: i,
            backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`
        });
    }

    // Add the empty tile (null)
    tiles.push(null);

    return tiles;
}

// Render the puzzle
function renderPuzzle() {
    puzzleContainer.innerHTML = ''; // Clear the container

    tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile' + (tile === null ? ' empty' : '');

        if (tile) {
            tileElement.style.backgroundImage = `url(${imageSrc})`;
            tileElement.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`; // 300% of the image for 3x3 grid
            tileElement.style.backgroundPosition = tile.backgroundPosition;
        }

        tileElement.addEventListener('click', () => handleTileClick(index));
        puzzleContainer.appendChild(tileElement);
    });

    if (checkWin()) {
        setTimeout(() => {
            alert('Congratulations! You solved the puzzle.');
        }, 100);
    }
}

// Handle tile click
function handleTileClick(index) {
    if (isAdjacent(index, emptyTileIndex)) {
        swapTiles(index, emptyTileIndex);
        renderPuzzle();
        emptyTileIndex = index;
    }
}

// Check if two indices are adjacent
function isAdjacent(index1, index2) {
    const row1 = Math.floor(index1 / gridSize);
    const col1 = index1 % gridSize;
    const row2 = Math.floor(index2 / gridSize);
    const col2 = index2 % gridSize;

    return (Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1);
}

// Swap two tiles
function swapTiles(index1, index2) {
    [tiles[index1], tiles[index2]] = [tiles[index2], tiles[index1]];
}

// Shuffle the puzzle and check for solvability
function shufflePuzzle() {
    let shuffledTiles;
    do {
        shuffledTiles = shuffle([...tiles]);
    } while (!isSolvable(shuffledTiles));

    tiles = shuffledTiles;
    emptyTileIndex = tiles.indexOf(null); // Update the empty tile position
    renderPuzzle();
}

// Fisher-Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Check if the puzzle is solvable
function isSolvable(puzzle) {
    const inversionCount = countInversions(puzzle.filter(tile => tile !== null));
    return inversionCount % 2 === 0;
}

// Count the number of inversions in the puzzle (ignoring the empty tile)
function countInversions(arr) {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].index > arr[j].index) inversions++;
        }
    }
    return inversions;
}

// Check if the puzzle is solved
function checkWin() {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] !== null && tiles[i].index !== i) {
            return false;
        }
    }
    return true;
}

// Event listeners
shuffleButton.addEventListener('click', shufflePuzzle);

// Initialize the puzzle on page load
initPuzzle();
