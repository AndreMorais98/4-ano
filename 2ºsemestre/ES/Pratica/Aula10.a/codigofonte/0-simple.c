#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv)
{
  int control;
  char buffer[64];

  printf("Endereço da variável buffer: %p\n",&buffer);
  printf("Endereço da variável control: %p\n",&control);
  

  printf("You win this game if you can change variable control'\n");

  control = 0;
  gets(buffer);

  if(control != 0) {
      printf("YOU WIN!!!\n");
  } else {
      printf("Try again...\n");
  }
}