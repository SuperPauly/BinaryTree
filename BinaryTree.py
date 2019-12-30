"""
Created by Paul Spedding - 2019

Info:
I have done this as a bit of a technical exercise and as a reminder of some of the
data structures/algorithms at university.

How It Works:
Their are 2 methods in which you can make tree's. One is to use Recursion which
is what I have used for this project. Another, is the use of loops which I have
done at University but unfortunately that code is long gone and to be quite honest
recursion is more of a complex way to do an insert.

Being a BinaryTree this should insert in O(Log(n)) Complexity.
"""


class BinaryTree:
    """
    This class holds the full tree but note the Nodes, All that is hidden in a sub class away from the user
    """
    def __init__(self) -> None:
        self.root = None

    def insert(self, data: object, key) -> None:
        """
        This does what it says 'on the tin!'. Inserts ye'olde Node into the tree.
        :param data: The data you want to be stored at the specific key
        :param key: The key in which we sort data by. an Integer, Float, or Double. No support for strings yet.
        :return: None
        """
        new_node = BinaryTree.Node(data=data, key=key)
        if self.root is None:
            self.root = BinaryTree.Node(key=key, data=data)  # If no node exists add one at the root
        else:
            if new_node > self.root:  # This functionality is provided by the Dunder methods defined in the Node class
                self.root.set_right(new_node, self.root)
            elif new_node < self.root:
                self.root.set_left(new_node, self.root)
            elif new_node == self.root:
                self.root.set_left(new_node, self.root)

    class Node:
        """
        Node is equivalent to a leaf.
        In this class I have decided to implement some 'magic methods' or Dunder methods as they are called.
        These are the ones that have double underscore before and after E.G __gt__ or __le__. These methods
        I have overridden so I can include some nice Pythonic code in the BinaryTree parent class.

        I was talking to someone who said why not just use node1.key() > rootNode.key()... HA Good one! This ain't Java

        """
        def __init__(self, key, data) -> None:
            self.key = key  # This is what we sort by
            self.data = data  # This is the data we want stored at the above key.
            self.left = None  # When a Node is created by default it has no children.
            self.right = None

        def set_right(self, data_object: object, root) -> None:
            """
            The set_right/set_left methods are pretty obvious to what they accomplish.
            I have commented below the more interesting parts like the recursive call.
            :param data_object:
            :param root:
            :return:
            """
            if root.right is None:  # IF Node is None create it at that point of the tree.
                root.right = data_object
            else:
                if data_object < root:  # If data_object.key < root
                    # The part below is recursive, I'm not passing in the self.root like insert(). I pass in root.right
                    self.set_right(data_object=data_object, root=root.right)
                else:
                    self.set_left(data_object=data_object, root=root.right)

        def set_left(self, data_object, root) -> None:
            """
            See set_right for similar behaviour, except it's right instead left. But you're schmart so you know this!
            :param data_object:
            :param root:
            :return:
            """
            if root.left is None:
                root.left = data_object
            else:
                if data_object < root:
                    self.set_left(data_object=data_object, root=root.left)
                else:
                    self.set_right(data_object=data_object, root=root.left)

        """
        Every method in Python that has the leading and trailing double underscore is called a magic method.
        Or more precisely a Dunder method. These Dunder methods have the ability to override the Object/Bultin 
        class in which we can define out own behaviour as can be seen in the comparisons I do in the insert() 
        method on BinaryTree class.
        
        While testing the Dunder methods I noticed you can add some odd behaviour in which you can return an 
        object from a comparison on a single line like a Ternary operator. This I will look into more!
        """
        def __eq__(self, other):  # Equal to '=='
            if self.key == other.key:
                return True
            else:
                return False

        def __lt__(self, other):  # Less than '<'
            if self.key < other.key:
                return True
            else:
                return False

        def __gt__(self, other):  # Greater than '>'
            if self.key > other.key:
                return True
            else:
                return False

        def __le__(self, other):  # Less than equal to '<='
            if self.key <= other.key:
                return True
            else:
                return False

        def __ge__(self, other):  # Greater than equal to '>='
            if self.key >= other.key:
                return True
            else:
                return False


class Person:
    """
    This is just a simple class to test the functionality of the BinaryTree class.
    I will turn this into a Unit Test case and potentially even some cucumber tests
    """
    def __init__(self, age, name):
        self.age = age
        self.name = name


if __name__ == "__main__":
    """
    This only runs when it is run from this file and not when we call it from anywhere else.
    If we import this as a module and run it the section with in the scope of
    __name__ == "__main__": will NOT run.
    
    This section is only for testing and debugging.
    """
    p1 = Person(32, "Tom")
    p2 = Person(73, "Dick")
    p3 = Person(15, "Harry")
    p4 = Person(54, "Dave")
    p5 = Person(46, "John")
    p6 = Person(8, "Brian")
    p7 = Person(35, "Paul")

    bt = BinaryTree()
    bt.insert(p1, p1.age)
    bt.insert(p2, p2.age)
    bt.insert(p3, p3.age)
    bt.insert(p4, p4.age)
    bt.insert(p5, p5.age)
    bt.insert(p6, p6.age)
    bt.insert(p7, p7.age)

    print("Breakpoint!!")
