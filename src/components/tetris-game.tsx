'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Pause, Play, VolumeX, Volume2, Sun, Moon } from "lucide-react"

type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'

type TetrominoShape = number[][]

type Tetromino = {
  shape: TetrominoShape
  color: string
  x: number
  y: number
}

type GameBoard = (string | 0)[][]

const TETROMINOS: Record<TetrominoType, TetrominoShape> = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]]
}

const COLORS: Record<TetrominoType, string> = {
  I: 'bg-cyan-500 dark:bg-cyan-400',
  J: 'bg-blue-500 dark:bg-blue-400',
  L: 'bg-orange-500 dark:bg-orange-400',
  O: 'bg-yellow-500 dark:bg-yellow-400',
  S: 'bg-green-500 dark:bg-green-400',
  T: 'bg-purple-500 dark:bg-purple-400',
  Z: 'bg-red-500 dark:bg-red-400'
}

export function TetrisGame(): JSX.Element {
  const [gameBoard, setGameBoard] = useState<GameBoard>(Array(20).fill(null).map(() => Array(10).fill(0)))
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null)
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [level, setLevel] = useState<number>(1)
  const [lines, setLines] = useState<number>(0)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)

  const getRandomTetromino = useCallback((): Tetromino => {
    const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    return {
      shape: TETROMINOS[randomPiece],
      color: COLORS[randomPiece],
      x: 3,
      y: 0
    }
  }, [])

  const isColliding = useCallback((shape: TetrominoShape, x: number, y: number): boolean => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] !== 0) {
          if (
            y + i >= gameBoard.length ||
            x + j < 0 ||
            x + j >= gameBoard[0].length ||
            gameBoard[y + i][x + j] !== 0
          ) {
            return true
          }
        }
      }
    }
    return false
  }, [gameBoard])

  const rotatePiece = useCallback((piece: Tetromino): Tetromino => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    )
    return { ...piece, shape: rotated }
  }, [])

  
  const checkLines = useCallback((board: GameBoard): void => {
    let linesCleared = 0
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++
        return false
      }
      return true
    })
    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(0))
    }
    setGameBoard(newBoard)
    setLines(prev => prev + linesCleared)
    setScore(prev => prev + linesCleared * 100 * level)
    if ((lines + linesCleared) % 10 === 0 && linesCleared > 0) {
      setLevel(prev => prev + 1)
    }
  }, [level, lines])
  
  const moveLeft = useCallback((): void => {
    if (!currentPiece || gameOver) return
    const newX = currentPiece.x - 1
    if (!isColliding(currentPiece.shape, newX, currentPiece.y)) {
      setCurrentPiece({...currentPiece, x: newX})
    }
  }, [currentPiece, isColliding, gameOver])

  const moveDown = useCallback((): void => {
    if (!currentPiece || gameOver) return
    const newY = currentPiece.y + 1
    if (isColliding(currentPiece.shape, currentPiece.x, newY)) {
      const newBoard = gameBoard.map(row => [...row])
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newBoard[y + currentPiece.y][x + currentPiece.x] = currentPiece.color
          }
        })
      })
      setGameBoard(newBoard)
      if (currentPiece.y <= 0) {
        setGameOver(true)
        return
      }
      setCurrentPiece(nextPiece)
      setNextPiece(getRandomTetromino())
      checkLines(newBoard) // ここに checkLines を追加
    } else {
      setCurrentPiece({...currentPiece, y: newY})
    }
  }, [currentPiece, gameBoard, nextPiece, isColliding, getRandomTetromino, gameOver, checkLines]); // 依存関係配列に checkLines を追加
  
  const moveRight = useCallback((): void => {
    if (!currentPiece || gameOver) return
    const newX = currentPiece.x + 1
    if (!isColliding(currentPiece.shape, newX, currentPiece.y)) {
      setCurrentPiece({...currentPiece, x: newX})
    }
  }, [currentPiece, isColliding, gameOver])

  const rotate = useCallback((): void => {
    if (!currentPiece || gameOver) return
    const rotatedPiece = rotatePiece(currentPiece)
    if (!isColliding(rotatedPiece.shape, rotatedPiece.x, rotatedPiece.y)) {
      setCurrentPiece(rotatedPiece)
    }
  }, [currentPiece, isColliding, rotatePiece, gameOver])

  const hardDrop = useCallback((): void => {
    if (!currentPiece || gameOver) return
    let newY = currentPiece.y
    while (!isColliding(currentPiece.shape, currentPiece.x, newY + 1)) {
      newY++
    }
    setCurrentPiece({...currentPiece, y: newY})
    moveDown()
  }, [currentPiece, isColliding, moveDown, gameOver])

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      setCurrentPiece(getRandomTetromino())
      setNextPiece(getRandomTetromino())
    }

    const handleKeyPress = (event: KeyboardEvent): void => {
      if (isPaused || gameOver) return
      switch (event.key) {
        case 'ArrowLeft':
          moveLeft()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowDown':
          moveDown()
          break
        case 'ArrowUp':
          rotate()
          break
        case ' ':
          hardDrop()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    const gameLoop = setInterval(() => {
      if (!isPaused && !gameOver) {
        moveDown()
      }
    }, 1000 - (level * 50))

    return () => {
      clearInterval(gameLoop)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [currentPiece, isPaused, level, moveDown, moveLeft, moveRight, rotate, hardDrop, getRandomTetromino, gameOver])

  const togglePause = (): void => setIsPaused(!isPaused)
  const toggleMute = (): void => setIsMuted(!isMuted)
  const toggleDarkMode = (): void => setIsDarkMode(!isDarkMode)

  const resetGame = (): void => {
    setGameBoard(Array(20).fill(null).map(() => Array(10).fill(0)))
    setCurrentPiece(null)
    setNextPiece(null)
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setIsPaused(false)
  }

  const renderGrid = (grid: GameBoard): JSX.Element => (
    <div className="grid gap-[1px] bg-gray-300 dark:bg-gray-700">
      {grid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-6 h-6 ${
                cell ? cell : 'bg-gray-100 dark:bg-gray-800'
              } border-r border-b border-gray-300 dark:border-gray-700`}
            />
          ))}
        </div>
      ))}
    </div>
  )

  const renderGameBoard = (): JSX.Element => {
    const board = gameBoard.map(row => [...row])
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = y + currentPiece.y
            const boardX = x + currentPiece.x
            if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
              board[boardY][boardX] = currentPiece.color
            }
          }
        })
      })
    }
    return renderGrid(board)
  }

  return (
    <div className={`h-screen flex items-center justify-center p-4 ${isDarkMode ? 'dark' : ''}`}>
      <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
              {renderGameBoard()}
            </div>
            {gameOver && (
              <div className="mt-4 text-center">
                <p className="text-xl font-bold text-red-600 dark:text-red-400">Game Over</p>
                <Button onClick={resetGame} className="mt-2">
                  Restart Game
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Next Piece</h2>
              <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                {nextPiece && renderGrid(nextPiece.shape.map(row => row.map(cell => cell ? nextPiece.color : 0)))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Score</h2>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{score}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Level</h2>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{level}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Lines</h2>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{lines}</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={togglePause} variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-300">
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button onClick={toggleMute} variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-300">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
                <label
                  htmlFor="dark-mode"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}