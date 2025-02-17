interface Point {
  x: number
  y: number
}

const directions: Point[] = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
]

function isValid(maze: number[][], point: Point): boolean {
  return (
    point.x >= 0 &&
    point.x < maze[0].length &&
    point.y >= 0 &&
    point.y < maze.length &&
    (maze[point.y][point.x] === 0 || maze[point.y][point.x] === 3)
  )
}

function reconstructPath(parent: Map<string, Point>, end: Point): Point[] {
  const path: Point[] = []
  let current: Point | undefined = end
  while (current) {
    path.unshift(current)
    current = parent.get(`${current.x},${current.y}`)
  }
  return path
}

export function dfs(maze: number[][], start: Point, end: Point): Point[] {
  console.log("Starting DFS", { start, end })
  const stack: Point[] = [start]
  const visited = new Set<string>()
  const parent = new Map<string, Point>()

  while (stack.length > 0) {
    const current = stack.pop()!
    const key = `${current.x},${current.y}`

    if (current.x === end.x && current.y === end.y) {
      const path = reconstructPath(parent, end)
      console.log("DFS path found:", path)
      return path
    }

    if (!visited.has(key)) {
      visited.add(key)

      for (const dir of directions) {
        const next: Point = { x: current.x + dir.x, y: current.y + dir.y }
        const nextKey = `${next.x},${next.y}`
        if (isValid(maze, next) && !visited.has(nextKey)) {
          stack.push(next)
          parent.set(nextKey, current)
        }
      }
    }
  }

  console.log("DFS: No path found")
  return []
}

export function bfs(maze: number[][], start: Point, end: Point): Point[] {
  console.log("Starting BFS", { start, end })
  const queue: Point[] = [start]
  const visited = new Set<string>()
  const parent = new Map<string, Point>()

  while (queue.length > 0) {
    const current = queue.shift()!
    const key = `${current.x},${current.y}`

    if (current.x === end.x && current.y === end.y) {
      const path = reconstructPath(parent, end)
      console.log("BFS path found:", path)
      return path
    }

    if (!visited.has(key)) {
      visited.add(key)

      for (const dir of directions) {
        const next: Point = { x: current.x + dir.x, y: current.y + dir.y }
        const nextKey = `${next.x},${next.y}`
        if (isValid(maze, next) && !visited.has(nextKey)) {
          queue.push(next)
          parent.set(nextKey, current)
        }
      }
    }
  }

  console.log("BFS: No path found")
  return []
}

function heuristic(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

export function astar(maze: number[][], start: Point, end: Point): Point[] {
  console.log("Starting A*", { start, end })
  const openSet = new Set<string>([`${start.x},${start.y}`])
  const closedSet = new Set<string>()
  const gScore = new Map<string, number>([[`${start.x},${start.y}`, 0]])
  const fScore = new Map<string, number>([[`${start.x},${start.y}`, heuristic(start, end)]])
  const parent = new Map<string, Point>()

  while (openSet.size > 0) {
    const current = Array.from(openSet).reduce((a, b) => (fScore.get(a)! < fScore.get(b)! ? a : b))

    if (current === `${end.x},${end.y}`) {
      const path = reconstructPath(parent, end)
      console.log("A* path found:", path)
      return path
    }

    openSet.delete(current)
    closedSet.add(current)

    const [x, y] = current.split(",").map(Number)
    for (const dir of directions) {
      const neighbor: Point = { x: x + dir.x, y: y + dir.y }
      const neighborKey = `${neighbor.x},${neighbor.y}`

      if (!isValid(maze, neighbor) || closedSet.has(neighborKey)) continue

      const tentativeGScore = gScore.get(current)! + 1

      if (!openSet.has(neighborKey)) {
        openSet.add(neighborKey)
      } else if (tentativeGScore >= gScore.get(neighborKey)!) {
        continue
      }

      parent.set(neighborKey, { x, y })
      gScore.set(neighborKey, tentativeGScore)
      fScore.set(neighborKey, gScore.get(neighborKey)! + heuristic(neighbor, end))
    }
  }

  console.log("A*: No path found")
  return []
}

