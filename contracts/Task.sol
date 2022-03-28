pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;
import "./Register.sol";

contract Task{
    address payable[] workers;   // 记录workers，方便转账
    address requester;  // 记录 requester
    string title;   // 任务标题
    string descriptionOfTask;    // 任务描述
    mapping(string => bool) answerList;  // 答案列表
    string[] list;
    uint answerCount;   // 已完成答案数
    uint award;    // 酬金
    uint numberOfWorkersNeeded;   // 需要完成的工人数
    uint unitAward; // 单个工人获得的酬金数
    bool finished;  //requester是否已经获取答案

    modifier onlyRequester {    // 创建限定符
        require(isRequester(), "Only requester can do that!");
        _;
    }

    constructor() public {
        title = "default";
        descriptionOfTask = "default";
        answerCount = 0;
        award = 0;
        numberOfWorkersNeeded = 0;
        unitAward = 0;
    }

    function addQuestion(string memory _title, string memory _descriptionOfTask, uint _numberOfWorkersNeeded) payable public {
        require(msg.value > 0 ether, "Must have award!"); // 必须预存酬金
        requester = msg.sender;
        title = _title;
        descriptionOfTask = _descriptionOfTask;
        numberOfWorkersNeeded = _numberOfWorkersNeeded;
        award = msg.value;
    }

    function getTitle() public returns(string memory) {
        return title;
    }

    function ifAnswered(string memory sender) public returns(bool){
        return answerList[sender];
    }

    // 回答问题
    function answerQuestion(Register reg, string memory user, string memory _answer) public {
        require(reg.isUser(user), "Must be a user!");
        require(!ifAnswered(user), "Must not submitted an answer!");
        answerList[user] = true;
        list.push(_answer);
        payAward();
        answerCount++;
    }

    function payAward() private {
        msg.sender.transfer(award / numberOfWorkersNeeded);
    }

    // 收集答案
    function collectAnswers() onlyRequester public returns(string[] memory) {
        //require(finished == true, "You haven't pay the awards!");
        return list;
    }

    function isRequester() view private returns(bool) { //  对外不可见
        return msg.sender == requester;
    }
}
