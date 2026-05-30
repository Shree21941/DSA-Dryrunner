// Language-specific starter code templates

const LANGUAGES = {
  javascript: {
    name: 'JavaScript',
    ext: '.js',
  },
  java: {
    name: 'Java',
    ext: '.java',
  },
  c: {
    name: 'C',
    ext: '.c',
  },
  cpp: {
    name: 'C++',
    ext: '.cpp',
  },
};

const STARTER_CODES = {
  'Two Sum': {
    javascript: `function twoSum(nums, target) {
    // Write your solution here
    // Return [index1, index2] where nums[index1] + nums[index2] = target
}`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        // Return [index1, index2] where nums[index1] + nums[index2] = target
        return new int[2];
    }
}`,
    c: `#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your solution here
    // Return array of size 2: [index1, index2]
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    return result;
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        // Return vector of size 2: [index1, index2]
        return {};
    }
};`,
  },
  'Binary Search': {
    javascript: `function binarySearch(nums, target) {
    // Write your solution here
    // Return index of target, or -1 if not found
}`,
    java: `class Solution {
    public int binarySearch(int[] nums, int target) {
        // Write your solution here
        // Return index of target, or -1 if not found
        return -1;
    }
}`,
    c: `int binarySearch(int* nums, int numsSize, int target) {
    // Write your solution here
    // Return index of target, or -1 if not found
    return -1;
}`,
    cpp: `class Solution {
public:
    int binarySearch(vector<int>& nums, int target) {
        // Write your solution here
        // Return index of target, or -1 if not found
        return -1;
    }
};`,
  },
  'Valid Parentheses': {
    javascript: `function isValid(s) {
    // Write your solution here
    // Return true if parentheses are valid, false otherwise
}`,
    java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        // Return true if parentheses are valid
        return false;
    }
}`,
    c: `#include <stdbool.h>

bool isValid(char* s) {
    // Write your solution here
    // Return true if parentheses are valid
    return false;
}`,
    cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        // Return true if parentheses are valid
        return false;
    }
};`,
  },
  'Merge Sorted Arrays': {
    javascript: `function merge(nums1, m, nums2, n) {
    // Write your solution here
    // Merge nums2 into nums1 (modify in-place)
}`,
    java: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your solution here
        // Merge nums2 into nums1 (modify in-place)
    }
}`,
    c: `void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {
    // Write your solution here
    // Merge nums2 into nums1 (modify in-place)
}`,
    cpp: `class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        // Write your solution here
        // Merge nums2 into nums1 (modify in-place)
    }
};`,
  },
  'Fibonacci Sequence': {
    javascript: `function fib(n) {
    // Write your solution here
    // Return F(n)
}`,
    java: `class Solution {
    public int fib(int n) {
        // Write your solution here
        // Return F(n)
        return 0;
    }
}`,
    c: `int fib(int n) {
    // Write your solution here
    // Return F(n)
    return 0;
}`,
    cpp: `class Solution {
public:
    int fib(int n) {
        // Write your solution here
        // Return F(n)
        return 0;
    }
};`,
  },
  'BFS - Graph Traversal': {
    javascript: `function bfs(graph) {
    // Write your solution here
    // graph: adjacency list (2D array)
    // Return nodes visited in BFS order
}`,
    java: `class Solution {
    public List<Integer> bfs(int[][] graph) {
        // Write your solution here
        // Return nodes visited in BFS order
        return new ArrayList<>();
    }
}`,
    c: `#include <stdlib.h>

void bfs(int** graph, int graphSize, int* result) {
    // Write your solution here
    // graph: adjacency list
    // Store visited nodes in result
}`,
    cpp: `class Solution {
public:
    vector<int> bfs(vector<vector<int>>& graph) {
        // Write your solution here
        // Return nodes visited in BFS order
        return {};
    }
};`,
  },
  'DFS - Graph Traversal': {
    javascript: `function dfs(graph) {
    // Write your solution here
    // graph: adjacency list (2D array)
    // Return nodes visited in DFS order
}`,
    java: `class Solution {
    public List<Integer> dfs(int[][] graph) {
        // Write your solution here
        // Return nodes visited in DFS order
        return new ArrayList<>();
    }
}`,
    c: `#include <stdlib.h>

void dfs(int** graph, int graphSize, int* result) {
    // Write your solution here
    // graph: adjacency list
    // Store visited nodes in result
}`,
    cpp: `class Solution {
public:
    vector<int> dfs(vector<vector<int>>& graph) {
        // Write your solution here
        // Return nodes visited in DFS order
        return {};
    }
};`,
  },
  'Dijkstra Shortest Path': {
    javascript: `function dijkstra(graph, start) {
    // Write your solution here
    // graph[i] contains [neighbor, weight] pairs
    // Return array of shortest distances from start
}`,
    java: `class Solution {
    public int[] dijkstra(int[][] graph, int start) {
        // Write your solution here
        // graph[i] contains [neighbor, weight] pairs
        // Return array of shortest distances
        return new int[graph.length];
    }
}`,
    c: `#include <stdlib.h>

int* dijkstra(int** graph, int graphSize, int start) {
    // Write your solution here
    // Return array of shortest distances
    int* distances = (int*)malloc(graphSize * sizeof(int));
    return distances;
}`,
    cpp: `class Solution {
public:
    vector<int> dijkstra(vector<vector<pair<int,int>>>& graph, int start) {
        // Write your solution here
        // Return vector of shortest distances
        return {};
    }
};`,
  },
  'LRU Cache': {
    javascript: `class LRUCache {
    constructor(capacity) {
        // Write your implementation
    }
    
    get(key) {
        // Return value or -1
    }
    
    put(key, value) {
        // Add or update key-value pair
    }
}`,
    java: `class LRUCache {
    public LRUCache(int capacity) {
        // Write your implementation
    }
    
    public int get(int key) {
        // Return value or -1
        return -1;
    }
    
    public void put(int key, int value) {
        // Add or update
    }
}`,
    c: `typedef struct {
    int capacity;
    // Add your implementation
} LRUCache;

LRUCache* lRUCacheCreate(int capacity) {
    // Create cache
    return NULL;
}

int lRUCacheGet(LRUCache* obj, int key) {
    // Get value
    return -1;
}`,
    cpp: `class LRUCache {
public:
    LRUCache(int capacity) {
        // Write your implementation
    }
    
    int get(int key) {
        // Return value or -1
        return -1;
    }
    
    void put(int key, int value) {
        // Add or update
    }
};`,
  },
  'Climbing Stairs': {
    javascript: `function climbStairs(n) {
    // Write your solution here
    // Return number of ways to climb n stairs
}`,
    java: `class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        // Return number of ways
        return 0;
    }
}`,
    c: `int climbStairs(int n) {
    // Write your solution here
    // Return number of ways
    return 0;
}`,
    cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your solution here
        // Return number of ways
        return 0;
    }
};`,
  },
};

module.exports = { LANGUAGES, STARTER_CODES };
