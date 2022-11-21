#include<windows.h>
#include<iostream>
#include<stack>
using namespace std;

#define ROW 16
#define COL 16
int maze[ROW][COL] = {
{ 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,},
{ 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1,},
{ 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1,},
{ 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1,},
{ 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1,},
{ 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1,},
{ 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,},
{ 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0,},
{ 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,},
{ 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1,},
{ 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1,},
{ 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1,},
{ 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1,},
{ 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1,},
{ 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1,},
{ 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0}
};

class point {
public:
    int x;
    int y;
    int dir;
    point(int x_in, int y_in, int dir_in = 0) {
        x = x_in;
        y = y_in;
        dir = dir_in;
    }
    bool equal(point s) {
        return (x == s.x && y == s.y);
    }
};

point find_next(point now)
{
    for (int i = 1; i <= 3; i++) {
        int next_x = now.x;
        int next_y = now.y;
        int next_dir = now.dir;
        //int dir = (now.dir + 4-i) % 4;
        int dir = (now.dir + i) % 4;
        if (dir == 0) { next_x -= 1; next_dir = 2; }
        if (dir == 1) { next_y -= 1; next_dir = 3; }
        if (dir == 2) { next_x += 1; next_dir = 0; }
        if (dir == 3) { next_y += 1; next_dir = 1; }

        if (next_x >= 0 && next_x < ROW && next_y >= 0 && next_y < COL && maze[next_x][next_y] == 0)
            return point(next_x, next_y, next_dir);
    }
    return point(0, 0, 0);
}

int main()
{
    point start(0, 0), end(ROW - 1, COL - 1);
    for (int i = 0; i < ROW; i++){
        for (int j = 0; j < COL; j++)
            cout<<maze[i][j]<<" ";
        cout << endl;
    }

    HANDLE hout;
    COORD coord;
    hout = GetStdHandle(STD_OUTPUT_HANDLE);

    stack<point> result;
    result.push(start);
    point cur = start;
    maze[cur.x][cur.y] = 2;
    coord.X = 2 * cur.y;coord.Y = cur.x;SetConsoleCursorPosition(hout, coord);
    cout << "\033[42m0 \033[0m";
    
    while (!cur.equal(end)){        
        point next = find_next(cur);
        if (!next.equal(start)){
            result.push(next);
            cur = next;
            maze[cur.x][cur.y] = 2;  // mark_signed
            coord.X = 2 * cur.y; coord.Y = cur.x; SetConsoleCursorPosition(hout, coord);
            cout<<"\033[42m0 \033[0m";
        }
        else{
            result.pop();
            maze[cur.x][cur.y] = 3;
            coord.X = 2 * cur.y; coord.Y = cur.x; SetConsoleCursorPosition(hout, coord);
            cout << "0 ";
            cur = result.top();
        }
        Sleep(50);
    }
    return 0;
}