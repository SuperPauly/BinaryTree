
class BinaryTree:
    def __init__(self):
        self.root = None

    def add(self, data, key):
        new_node = BinaryTree.Node(data=data, key=key)
        if self.root is None:
            self.root = BinaryTree.Node(key=key, data=data)
        else:
            if new_node > self.root:
                self.root.set_right(new_node, self.root)
            elif new_node < self.root:
                self.root.set_left(new_node, self.root)
            elif new_node == self.root:
                self.root.set_left(new_node, self.root)

    class Node:
        def __init__(self, key, data):
            self.key = key
            self.data = data
            self.left = None
            self.right = None

        def set_right(self, data_object, root):
            if root.right is None:
                root.right = data_object
            else:
                if data_object < root:
                    self.set_right(data_object=data_object, root=root.right)
                else:
                    self.set_left(data_object=data_object, root=root.right)

        def set_left(self, data_object, root):
            if root.left is None:
                root.left = data_object
            else:
                if data_object < root:
                    self.set_left(data_object=data_object, root=root.left)
                else:
                    self.set_right(data_object=data_object, root=root.left)

        def __eq__(self, other):
            if self.key == other.key:
                return True
            else:
                return False

        def __lt__(self, other):
            if self.key < other.key:
                return True
            else:
                return False

        def __gt__(self, other):
            if self.key > other.key:
                return True
            else:
                return False

        def __le__(self, other):
            if self.key <= other.key:
                return True
            else:
                return False

        def __ge__(self, other):
            if self.key >= other.key:
                return True
            else:
                return False


class Person:
    def __init__(self, age, name):
        self.age = age
        self.name = name


if __name__ == "__main__":
    p1 = Person(32, "Tom")
    p2 = Person(73, "Dick")
    p3 = Person(15, "Harry")
    p4 = Person(54, "Dave")
    p5 = Person(46, "John")
    p6 = Person(8, "Brian")
    p7 = Person(35, "Paul")

    bt = BinaryTree()
    bt.add(p1, p1.age)
    bt.add(p2, p2.age)
    bt.add(p3, p3.age)
    bt.add(p4, p4.age)
    bt.add(p5, p5.age)
    bt.add(p6, p6.age)
    bt.add(p7, p7.age)

    print("Breakpoint!!")