import React from "react";
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  HomeOutlined,
  LeftCircleOutlined,
  LoadingOutlined,
  MoonOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RightCircleFilled,
  SunOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  Collapse,
  ColorPicker,
  ConfigProvider,
  Divider,
  Flex,
  Image,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Slider,
  Spin,
  Statistic,
  Switch,
  Table,
  theme,
  Tour,
  Typography,
  Upload,
  Watermark,
} from "antd";
import { Button, Steps } from "antd";
import logo from "./assets/icon.png";
import thumbUp from "./assets/emoticon_thumbup_gray.png";
import smile from "./assets/emoticon_smiley_gray.png";
import Title from "antd/es/typography/Title";
import Marquee from "react-fast-marquee";
import fs from "file-saver";
import html2canvas from "html2canvas";
import moment from "moment";
import translData from "./data.json";
import { useVercount } from "vercount-react";
import CountUp from "react-countup";
import priceData from "./price.json";
import priceTxt from "./og_price.json";
import useLocalStorageState from "use-local-storage-state";

const formatter = (value) => <CountUp end={value} separator="," />;

const { Header, Content, Footer, Sider } = Layout;
const items = [
  { key: 1, icon: React.createElement(HomeOutlined), label: "首页" },
];
function removeDuplicates(arr) {
  const seen = new Map();
  return arr.filter((item) => {
    if (!seen.has(item.key)) {
      seen.set(item.key, true);
      return true;
    }
    return false;
  });
}

const imageModules = import.meta.glob("./assets/items/*.png", { eager: true });

const preloadedUrls = Object.fromEntries(
  Object.entries(imageModules).map(([path, module]) => [path, module.default])
);

// 整整50行没啥用的东西
const lines = [
  "时光荏苒，记忆如沙",
  "梦想在远方，脚步在当下",
  "城市灯火，永不熄灭的星辰",
  "爱是无声的诗，来自心底",
  "雨滴轻敲窗，思绪随风飘",
  "书籍是沉默的导师，指引迷途",
  "音乐响起，灵魂开始舞蹈",
  "自然之声，治愈疲惫的心灵",
  "友情如茶，苦涩中带甜",
  "科技之光，照亮未知的黑暗",
  "旅行是写给自己的情书",
  "美食的香气，唤醒沉睡的味蕾",
  "星空之下，我们都是宇宙的孩子",
  "坚持是通往成功的桥梁",
  "时间如流水，一去不复返",
  "微笑是打开心门的钥匙",
  "家是永远的避风港",
  "工作与休闲，生活的双翼",
  "学习是永不停歇的旅程",
  "健康是生命的基石",
  "环保行动，守护地球家园",
  "创新是未来的引擎",
  "历史的长河，映照今日",
  "艺术是情感的出口",
  "运动释放能量，焕发活力",
  "冥想中，找到内心的宁静",
  "幽默是生活的调味剂",
  "诚实赢得信任，虚伪带来孤独",
  "失败是成长的阶梯",
  "感恩每一刻，珍惜小幸福",
  "好奇心驱动世界的进步",
  "耐心等待，花开有时",
  "分享快乐，温暖倍增",
  "孤独是自我对话的时光",
  "希望是黑暗中的灯塔",
  "勇气征服恐惧，成就非凡",
  "简单生活，回归本真",
  "科技便利，也需警惕依赖",
  "文化交融，世界更精彩",
  "教育点燃希望的火种",
  "和平是人类的共同梦想",
  "爱情需要用心浇灌",
  "自然奇观，令人叹为观止",
  "城市节奏，永不停歇的心跳",
  "信息洪流，筛选真知",
  "AI时代，人机共生",
  "虚拟世界，真实情感",
  "可持续发展，留给未来的礼物",
  "心理健康，不可忽视",
  "别光顾着看，你也是这列表的一部分",
];

const App = () => {
  const getRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * lines.length);
    return lines[randomIndex];
  };
  const [randomItem, setRandomItem] = React.useState("");
  React.useEffect(() => {
    setRandomItem(getRandomItem());
  }, []);

  const [imageUrls, setImageUrls] = React.useState({});
  const [spinning, setSpinning] = React.useState(false);
  React.useEffect(() => {
    setSpinning(true);
    message.open({
      type: "info",
      content: `目前包含${Object.keys(preloadedUrls).length}个物品`,
      duration: 3,
    });

    setImageUrls(preloadedUrls);
    setSpinning(false);
  }, []);
  const [currentTime, setCurrentTime] = React.useState(new moment().format());
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new moment().format());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  var opti = [];
  Object.entries(imageUrls).forEach((key, value) => {
    var n = key[0].replace("./assets/items/", "").replace(".png", "");
    opti = opti.concat([
      {
        value: n,
        label: translData[n]?.cn_name
          ? `${translData[n].cn_name + "-" + translData[n].en_name} (${n})`
          : n,
      },
    ]);
  });

  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);
  const ref4 = React.useRef(null);
  const ref5 = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const tSteps = [
    {
      title: "欢迎",
      description: "欢迎使用RWRSG，我们来进行一个简单的漫游式引导以熟悉界面",
      cover: <img src={smile} style={{ maxWidth: "100px" }} />,
    },
    {
      title: "导入数据",
      description: "导入被导出数据。注意：重复部分会自动合并，或者去重",
      target: () => ref1.current,
    },
    {
      title: "下一步",
      description: "前往下一个步骤",
      target: () => ref2.current,
    },
    {
      title: "添加售卖物",
      description: "你可以多选售卖物一次性添加",
      target: () => ref3.current,
    },
    {
      title: "物品表单",
      description: "在这里预览你选择的售卖物",
      target: () => ref4.current,
    },
    {
      title: "进度条",
      description: "指示正在进行和即将进行的步骤",
      target: () => ref5.current,
    },
    {
      title: "导览结束",
      description: "那么我们就到这里，接下来自己发挥。干杯！继续奔跑下去！",
      cover: <img src={thumbUp} style={{ maxWidth: "100px" }} />,
    },
  ];
  const [data, setData] = useLocalStorageState("data", {
    defaultValue: [
      { key: "lottery", name: "彩票", price: 1700, num: 1 },
      { key: "vest3", name: "Ⅲ型防弹背心", price: 200, num: 2 },
      { key: "aug", name: "斯太尔AUG突击步枪", price: 250, num: 5 },
    ],
  });
  const columns = [
    {
      title: "图片",
      dataIndex: "key",
      key: "key",
      render: (text) => (
        <>
          <Image
            width={50}
            src={imageUrls["./assets/items/" + text + ".png"]}
            fallback="data:image/png;base64,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"
          />
        </>
      ),
    },
    {
      title: "标识",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "操作",
      key: "delete",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            setData(
              removeDuplicates(
                data.filter(function (item) {
                  return item.key !== record.key;
                })
              )
            );

            if (record.key.length > 0)
              message.open({
                type: "success",
                content: "删除" + record.name,
                duration: 3,
              });
          }}
          style={{ textWrap: "wrap" }}
        />
      ),
    },
  ];
  const [editKey, setEditKey] = React.useState("");
  const [editMode, setEditMode] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const columns2 = [
    {
      title: "图片/名称",
      dataIndex: "key",
      key: "key",
      fixed: "right",
      render: (text, record) => (
        <div>
          <Image
            width={50}
            src={imageUrls["./assets/items/" + text + ".png"]}
            fallback="data:image/png;base64,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"
          />
          <Button
            type="link"
            size="small"
            autoInsertSpace={false}
            onClick={() => {
              setEditKey(record),
                setEditMode("name"),
                setEditModal(record.name),
                setIsModalOpen(true);
            }}
          >
            {record.name ? <>{record.name}</> : <>未设定</>}
          </Button>
        </div>
      ),
    },
    {
      title: "标识",
      dataIndex: "key",
      key: "key",

      responsive: ["sm"],
    },
    {
      title: "价格(rp)",
      dataIndex: "price",
      key: "price",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.price - b.price,

      render: (text, record) => (
        <>
          <Button
            type="link"
            autoInsertSpace={false}
            onClick={() => {
              setEditKey(record),
                setEditMode("price"),
                setEditModal(record.price),
                setIsModalOpen(true);
            }}
          >
            {text ? <>{text}rp</> : <>未设定</>}
          </Button>
        </>
      ),
    },
    {
      title: "数量(个)",
      dataIndex: "num",
      key: "num",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.num - b.num,

      render: (text, record) => (
        <>
          <Button
            type="link"
            autoInsertSpace={false}
            onClick={() => {
              setEditKey(record),
                setEditMode("num"),
                setEditModal(record.num),
                setIsModalOpen(true);
            }}
          >
            {text ? <>{text}</> : <>未设定</>}
          </Button>
        </>
      ),
    },
  ];

  const [addChoise, setAddChoice] = React.useState([]);
  const handleAddChoiseChange = (value) => {
    setAddChoice(value);
  };
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "delete",
        text: "删除所选项",
        onSelect: (changeableRowKeys) => {
          //console.log("orgin data:", data);
          //console.log("rows to del:", selectedRowKeys);
          var newData = data.filter(function (item) {
            var delFlag = false;
            selectedRowKeys.forEach((itemToDel) => {
              //console.log("current:", item, "target:", itemToDel);
              //console.log("out:", item.key == itemToDel);
              if (item.key == itemToDel) delFlag = true;
            });
            return !delFlag;
          });
          //console.log("result data:", newData);
          setData(removeDuplicates(newData));
          if (selectedRowKeys.join().length > 0)
            message.open({
              type: "success",
              content: "删除" + selectedRowKeys.join(),
              duration: 3,
            });
          setSelectedRowKeys([]);
        },
      },
    ],
  };
  const [editModal, setEditModal] = React.useState();
  const canvasRef = React.useRef(null);
  const [editableStr, setEditableStr] = useLocalStorageState("title", {
    defaultValue: "RWR摆摊生成器",
  });
  const [picWidth, setPicWidth] = React.useState();
  const [showName, setShowName] = useLocalStorageState("showName", {
    defaultValue: false,
  });
  const [showPrice, setShowPrice] = useLocalStorageState("showPrice", {
    defaultValue: true,
  });
  const [showID, setShowID] = useLocalStorageState("showID", {
    defaultValue: false,
  });
  const [showNum, setShowNum] = useLocalStorageState("showNum", {
    defaultValue: false,
  });
  const [color, setColor] = useLocalStorageState("color", {
    defaultValue: "#ffffff",
  });
  const [txtColor, setTxtColor] = useLocalStorageState("txtColor", {
    defaultValue: "#000000",
  });
  const steps = [
    {
      title: "售卖物",
      content: (
        <>
          <Row style={{ justifyContent: "space-evenly" }}>
            <Col xs={{ flex: "100%" }} sm={{ flex: "70%" }}>
              <div ref={ref4}>
                <Table
                  size="small"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={data}
                />
              </div>
            </Col>
            <Col xs={{ flex: "100%" }} sm={{ flex: "25%" }}>
              <Card
                title="添加售卖物"
                variant="borderless"
                style={{ height: "100%" }}
              >
                <div ref={ref3} style={{ height: "100%" }}>
                  <Select
                    showSearch
                    placeholder="请输入名称"
                    mode="multiple"
                    size="small"
                    prefix={<AppstoreAddOutlined />}
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    onChange={handleAddChoiseChange}
                    value={addChoise}
                    options={opti}
                    tokenSeparators={[","]}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={() => {
                      if (addChoise.join().length <= 0) return true;
                      var newData = [];
                      addChoise.forEach(function (item) {
                        newData = newData.concat([
                          {
                            key: item,
                            name: translData[item]?.cn_name
                              ? `${translData[item].cn_name}`
                              : item,
                            price: priceData[item] ?? 0,
                          },
                        ]);
                      });
                      setData(removeDuplicates(data.concat(newData)));
                      message.open({
                        type: "success",
                        content: "增加" + addChoise.join(),
                        duration: 3,
                      });
                      setAddChoice([]);
                    }}
                  />
                  <Alert
                    type="info"
                    closable
                    message="添加完成后在属性中：如果物品有翻译会自动显示中文翻译，
                    如果物品在群中有标价会自动添加价格（暂无收藏品/破损物/武器其他模式价格）"
                    showIcon
                    style={{ margin: "10px 0" }}
                  />
                  <Collapse
                    accordion
                    items={[
                      {
                        key: "1",
                        label: "群价数据源",
                        children: <p>{priceTxt["txt"]}</p>,
                      },
                    ]}
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "属性",
      content: (
        <>
          <Table virtual size="small" columns={columns2} dataSource={data} />
          <Modal
            title={
              "设置" + editKey.key + "(" + editKey.name + ")" + "的" + editMode
            }
            open={isModalOpen}
            onOk={() => {
              setData(
                data.map((item) => {
                  if (editKey.key == item.key) {
                    item[editMode] = editModal;
                  }
                  return item;
                })
              );
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
          >
            {editMode == "name" ? (
              <Input
                style={{ width: "50%" }}
                value={editModal}
                onChange={(event) => setEditModal(event.target.value)}
              />
            ) : (
              <InputNumber
                suffix={editMode == "price" ? "rp" : ""}
                style={{ width: "50%" }}
                value={editModal}
                onChange={(value) => setEditModal(value)}
              />
            )}
          </Modal>
        </>
      ),
    },
    {
      title: "保存",
      content: (
        <>
          <Alert message="如果尺寸不合适可以在下方调整宽度" closable showIcon />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                border: "2px solid #0000FF",
                borderStyle: "dashed",
                backgroundColor: color,
              }}
            >
              <div
                ref={canvasRef}
                style={Object.assign(
                  { backgroundColor: color },
                  picWidth ? { width: picWidth + "px" } : {}
                )}
              >
                <Watermark
                  //height={88 / 4}
                  //width={700 / 4}
                  content={[editableStr, currentTime]}
                  //image={rwrIcon}
                >
                  <ConfigProvider
                    theme={{
                      token: {
                        colorText: txtColor,
                        colorTextDescription: txtColor,
                        fontFamily: "komikax",
                      },
                    }}
                  >
                    <Typography.Title
                      editable={{
                        tooltip: "点击来修改",
                        onChange: setEditableStr,
                      }}
                      style={{ textAlign: "center", margin: "0" }}
                    >
                      {editableStr}
                    </Typography.Title>
                    <Flex wrap gap="small" justify="center">
                      {data.map((item) => (
                        <div
                          key={item.key}
                          className="grid-item"
                          style={{
                            lineHeight: "0",
                            textAlign: "center",
                            minHeight: "100%",
                          }}
                        >
                          <div //图片限制大小居中
                            style={{
                              maxHeight: "200px",
                              width: "100%",
                              alignContent: "center",
                            }}
                          >
                            <img
                              src={
                                imageUrls["./assets/items/" + item.key + ".png"]
                              }
                              style={{
                                maxHeight: "200px",
                                maxWidth: "100px",
                                margin: "0 0",
                              }}
                            />
                          </div>
                          {showName ? (
                            <Typography.Title style={{ margin: "0" }} level={5}>
                              {item.name}
                            </Typography.Title>
                          ) : (
                            ""
                          )}
                          {showID ? (
                            <Typography>
                              {"("}
                              {item.key}
                              {")"}
                            </Typography>
                          ) : (
                            ""
                          )}
                          {showPrice ? (
                            <Statistic
                              title="单个价格"
                              prefix={<DollarCircleOutlined />}
                              value={
                                item.price ? item.price + "rp" : "暂无价格"
                              }
                            />
                          ) : (
                            ""
                          )}
                          {showNum ? (
                            <Statistic
                              title="库存量"
                              prefix={<AppstoreOutlined />}
                              value={item.num ? item.num + "个" : "暂无数据"}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </Flex>
                  </ConfigProvider>
                </Watermark>
              </div>
            </div>
          </div>
          <Card title="导出设置面板">
            <div
              style={{
                gap: "20px",
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <Slider
                  placeholder="宽度"
                  value={picWidth}
                  onChange={(value) => setPicWidth(value)}
                  suffix="px"
                  changeOnWheel
                  min={1}
                  max={2000}
                  style={{ width: "200px" }}
                />
                <InputNumber
                  placeholder="宽度"
                  value={picWidth}
                  onChange={(value) => setPicWidth(value)}
                  suffix="px"
                  changeOnWheel
                  min={1}
                />
              </div>
              <Switch
                checkedChildren="显示中文名称"
                unCheckedChildren="隐藏中文名称"
                value={showName}
                onChange={() => setShowName(!showName)}
              />
              <Switch
                checkedChildren="显示物品ID"
                unCheckedChildren="隐藏物品ID"
                value={showID}
                onChange={() => setShowID(!showID)}
              />
              <Switch
                checkedChildren="显示价格"
                unCheckedChildren="隐藏价格"
                value={showPrice}
                onChange={() => setShowPrice(!showPrice)}
              />
              <Switch
                checkedChildren="显示库存量"
                unCheckedChildren="隐藏库存量"
                value={showNum}
                onChange={() => setShowNum(!showNum)}
              />
              <ColorPicker
                showText
                format="hex"
                value={color}
                onChange={(value) => setColor(value.toHexString())}
              />
              <ColorPicker
                showText
                format="hex"
                value={txtColor}
                onChange={(value) => setTxtColor(value.toHexString())}
              />
            </div>
          </Card>
        </>
      ),
    },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { token } = theme.useToken();
  const [current, setCurrent] = React.useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const props = {
    name: "file",
    showUploadList: false,
    beforeUpload: (file, fileList) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        var newData = JSON.parse(reader.result);
        newData = data.concat(newData);
        setData(removeDuplicates(newData));
      };
      return false; //cancel upload
    },
  };
  var [isBright, setIsBright] = React.useState(true);
  const { sitePv, pagePv, siteUv } = useVercount();
  return (
    <ConfigProvider theme={isBright ? {} : { algorithm: theme.darkAlgorithm }}>
      <Layout style={{ height: "100vh" }}>
        <Alert
          banner
          type="info"
          message={
            <Marquee pauseOnHover gradient={false}>
              All Running With Rifles assets © 2015 - {new Date().getFullYear()}{" "}
              Osumia Games. This site not affiliated with Osumia Games. This is
              a fan-made website. 所有Running With Rifles资产©2015 -{" "}
              {new Date().getFullYear()} Osumia Games。本网站不隶属于Osumia
              Games。这是一个玩家制作的网站。
            </Marquee>
          }
        />
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            background: "#7da109",
          }}
        >
          <img src={logo} />
          <Title
            style={{
              margin: "auto 10px",
              color: colorBgContainer,
              textWrap: "nowrap",
            }}
          >
            RWRSG
          </Title>
          <div style={{ flex: 1 }} />
          <Switch
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            defaultChecked
            value={isBright}
            onChange={(value) => setIsBright(value)}
          />
        </Header>
        <Tour open={open} onClose={() => setOpen(false)} steps={tSteps} />
        <div style={{ overflow: "auto", flex: "1" }} ref={ref5}>
          <Content style={{ padding: "16px 16px" }}>
            <div
              style={{
                padding: 24,
                borderRadius: borderRadiusLG,
              }}
            >
              <Spin
                spinning={spinning}
                indicator={<LoadingOutlined spin />}
                size="large"
              >
                <Steps
                  current={current}
                  items={items}
                  onChange={(value) => {
                    setCurrent(value);
                  }}
                />
                <div style={contentStyle}>{steps[current].content}</div>
                <div style={{ marginTop: 24 }}>
                  {current < steps.length - 1 && (
                    <Button
                      type="primary"
                      onClick={() => next()}
                      icon={<RightCircleFilled />}
                      ref={ref2}
                      style={{ marginRight: "8px" }}
                    >
                      下一步
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        style={{ marginBottom: "8px" }}
                        onClick={() =>
                          fs.saveAs(
                            new Blob([JSON.stringify(data)], {
                              type: "text/plain;charset=utf-8",
                            }),
                            "RWRSG-" + new Date().getTime() + ".json"
                          )
                        }
                      >
                        保存数据
                      </Button>
                      <Button
                        type="primary"
                        style={{ marginLeft: "8px", marginRight: "8px" }}
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          html2canvas(canvasRef.current).then((canvas) => {
                            canvas.toBlob((blob) => {
                              if (blob) {
                                // 使用FileSaver保存文件
                                saveAs(
                                  blob,
                                  "RWRSG-" + new Date().getTime() + ".png"
                                );
                              }
                            });
                          });
                        }}
                      >
                        保存图片
                      </Button>
                    </>
                  )}
                  {current > 0 && (
                    <Button
                      onClick={() => prev()}
                      icon={<LeftCircleOutlined />}
                    >
                      上一步
                    </Button>
                  )}
                  {current == 0 && (
                    <>
                      <Upload {...props}>
                        <Button
                          ref={ref1}
                          style={{ marginRight: "8px" }}
                          icon={<UploadOutlined />}
                        >
                          导入数据
                        </Button>
                      </Upload>
                      <Button
                        icon={<QuestionCircleOutlined />}
                        onClick={() => setOpen(true)}
                        style={{ margin: "8px 0" }}
                      >
                        导览帮助
                      </Button>
                    </>
                  )}
                </div>
              </Spin>
            </div>
          </Content>
          <Divider>{randomItem}</Divider>
          <Row justify="space-evenly">
            <Statistic
              value={siteUv}
              title="曾经有人来过"
              suffix="位"
              formatter={formatter}
              prefix={<UserOutlined />}
            />
            <Statistic
              value={sitePv}
              title="过去有人看过"
              suffix="次"
              formatter={formatter}
              prefix={<EyeOutlined />}
            />
            <Statistic
              value={pagePv}
              title="本页有次见过"
              suffix="个"
              formatter={formatter}
              prefix={<FileTextOutlined />}
            />
          </Row>
          <a href="https://github.com/bananaxiao2333/rwrsg">
            <Row
              justify="space-evenly"
              style={{ margin: "20px 0", padding: "10px" }}
            >
              <img src="https://img.shields.io/github/contributors/bananaxiao2333/rwrsg?label=%E8%B4%A1%E7%8C%AE%E8%80%85%E6%95%B0" />
              <img src="https://img.shields.io/github/commit-activity/t/bananaxiao2333/rwrsg?label=%E8%B4%A1%E7%8C%AE%E6%AC%A1%E6%95%B0" />
              <img src="https://img.shields.io/github/actions/workflow/status/bananaxiao2333/rwrsg/.github%2Fworkflows%2Fghpage.yml?label=%E6%9E%84%E5%BB%BA%E7%8A%B6%E6%80%81" />
              <img src="https://img.shields.io/github/last-commit/bananaxiao2333/rwrsg?label=%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4" />
            </Row>
          </a>
        </div>
      </Layout>
    </ConfigProvider>
  );
};
export default App;
