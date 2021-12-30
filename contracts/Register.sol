pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;
contract Register {
    string[] users;    // 用户列表

    function addUser(string memory _add) public {
        users.push(_add);
    }

    function getUsers () public view returns (string[] memory) {
        return users;
    }

    function getCountOfUsers() public view returns (uint) {
        return users.length;
    }

    function isUser(string memory _add) public view returns (bool) {
        for (uint i = 0; i < users.length; i++) {
            if (keccak256(abi.encodePacked(users[i])) == keccak256(abi.encodePacked(_add))) {
                return true;
            }
        }
        return false;
    }

}