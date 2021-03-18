-- phpMyAdmin SQL Dump
-- version phpStudy 2014
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2020 年 09 月 07 日 14:34
-- 服务器版本: 5.5.53
-- PHP 版本: 5.4.45

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `shop_db`
--

-- --------------------------------------------------------

--
-- 表的结构 `banner`
--

CREATE TABLE IF NOT EXISTS `banner` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '轮播图id',
  `title` varchar(50) NOT NULL COMMENT '轮播图标题',
  `img` varchar(255) NOT NULL COMMENT '轮播图图片地址',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='轮播图表' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `banner`
--

INSERT INTO `banner` (`id`, `title`, `img`, `status`) VALUES
(1, '轮播图1', '/uploads/banner/8f581960-7033-11ea-90dd-3b8abd26afb2.jpg', 1),
(2, '轮播图2', '/uploads/banner/972ca570-7033-11ea-90dd-3b8abd26afb2.jpg', 1);

-- --------------------------------------------------------

--
-- 表的结构 `cart`
--

CREATE TABLE IF NOT EXISTS `cart` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '购物车主键',
  `uid` varchar(50) NOT NULL COMMENT '用户id',
  `goodsid` int(11) NOT NULL COMMENT '商品编号',
  `num` tinyint(3) NOT NULL COMMENT '数量',
  `status` tinyint(1) NOT NULL COMMENT '选中状态',
  `checked` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uid` (`uid`,`goodsid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='购物车表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '分类编号',
  `pid` smallint(5) unsigned NOT NULL COMMENT '上级分类编号',
  `catename` varchar(50) NOT NULL COMMENT '分类名称',
  `img` varchar(255) NOT NULL COMMENT '分类图片',
  `status` tinyint(1) unsigned NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='商品分类表' AUTO_INCREMENT=24 ;

--
-- 转存表中的数据 `category`
--

INSERT INTO `category` (`id`, `pid`, `catename`, `img`, `status`) VALUES
(1, 0, '家用电器', '', 1),
(2, 0, '手机通讯', '', 1),
(3, 0, '电脑办公', '', 1),
(5, 0, '服装', '', 1),
(7, 1, '电视', '/uploads/category/fc3abc50-6c2c-11ea-b86c-579aced212c2.jpg', 1),
(8, 1, '空调', '/uploads/category/354b31f0-6c2d-11ea-b86c-579aced212c2.jpg', 1),
(9, 1, '洗衣机', '/uploads/category/436e9470-6c2d-11ea-b86c-579aced212c2.jpg', 1),
(10, 2, '诺基亚手机', '/uploads/category/fee7e580-6c2d-11ea-b86c-579aced212c2.png', 1),
(11, 3, '笔记本', '/uploads/category/ddb0b9f0-6de0-11ea-a8e1-0d680bf54839.jpg', 1),
(12, 2, '手机配件', '/uploads/category/764b6740-9673-11ea-b348-a734901db180.jpg', 1),
(13, 2, '小米手机', '/uploads/category/91238110-9673-11ea-b348-a734901db180.jpg', 1),
(14, 2, 'oppo手机', '/uploads/category/5f200c50-9674-11ea-b348-a734901db180.jpg', 1),
(15, 3, 'mac本', '/uploads/category/86b1e680-9674-11ea-b348-a734901db180.jpg', 1),
(16, 3, '华为笔记本', '/uploads/category/a740dc80-9674-11ea-b348-a734901db180.jpg', 1),
(17, 3, '戴尔笔记本', '/uploads/category/b63aeff0-9674-11ea-b348-a734901db180.jpg', 1),
(18, 0, '男鞋', '', 1),
(19, 0, '女鞋', '', 1),
(20, 0, '化妆品', '', 1),
(21, 0, '运动户外', '', 1),
(22, 0, '家居', '', 1),
(23, 22, '沙发', '/uploads/category/ef45aa90-e905-11ea-a704-bdeb1279090d.jpg', 1);

-- --------------------------------------------------------

--
-- 表的结构 `goods`
--

CREATE TABLE IF NOT EXISTS `goods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '商品编号',
  `first_cateid` smallint(5) unsigned NOT NULL COMMENT '一级分类编号',
  `second_cateid` smallint(6) NOT NULL COMMENT '二级分类编号',
  `goodsname` varchar(100) NOT NULL COMMENT '商品名称',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `market_price` decimal(10,2) NOT NULL COMMENT '市场价格',
  `img` varchar(255) NOT NULL COMMENT '商品图片',
  `description` text COMMENT '商品描述',
  `specsid` int(11) NOT NULL COMMENT '规格id',
  `specsattr` varchar(255) NOT NULL COMMENT '规则属性值',
  `isnew` tinyint(1) NOT NULL COMMENT '是否新品1是2不是',
  `ishot` tinyint(1) NOT NULL COMMENT '是否热卖1是2不是',
  `status` tinyint(1) NOT NULL COMMENT '状态1启用2禁用',
  `number` tinyint(5) NOT NULL DEFAULT '100' COMMENT '商品库存',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='商品表' AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `goods`
--

INSERT INTO `goods` (`id`, `first_cateid`, `second_cateid`, `goodsname`, `price`, `market_price`, `img`, `description`, `specsid`, `specsattr`, `isnew`, `ishot`, `status`, `number`) VALUES
(1, 2, 10, '小米10', '3999.00', '3999.00', '/uploads/fa5c2790-6c48-11ea-b894-9bd516f4e52e.jpg', '<p>11</p><p>22</p><p>33</p>', 3, '白色,黑色', 0, 1, 1, 100),
(2, 3, 11, '联想小新', '4499.00', '4699.00', '/uploads/2747d670-6de1-11ea-a8e1-0d680bf54839.jpg', '<p><img src="https://img30.360buyimg.com/sku/jfs/t1/92075/21/15594/69153/5e7332afE99041ba5/6796969792546bcf.jpg" style="max-width:100%;"><br></p>', 3, '白色', 1, 0, 1, 100),
(3, 2, 10, '荣耀9X', '1299.00', '1399.00', '/uploads/d6a0eff0-70be-11ea-91a2-9395060d7390.jpg', '', 3, '白色', 1, 2, 1, 100),
(4, 2, 10, '华为matep30', '3999.00', '4999.00', '/uploads/fb704ec0-70be-11ea-91a2-9395060d7390.jpg', '', 3, '黑色', 2, 2, 1, 100),
(5, 3, 11, '华为MateBook13', '4299.00', '4597.00', '/uploads/1faae7a0-70bf-11ea-91a2-9395060d7390.jpg', '', 3, '白色', 2, 1, 1, 100),
(6, 3, 11, '华为MateBook14', '5299.00', '4597.00', '/uploads/1faae7a0-70bf-11ea-91a2-9395060d7390.jpg', '', 3, '白色', 2, 1, 1, 100),
(7, 3, 11, '华为MateBook15', '6299.00', '4597.00', '/uploads/1faae7a0-70bf-11ea-91a2-9395060d7390.jpg', '', 3, '白色', 2, 1, 1, 100),
(8, 3, 11, '华为MateBook16', '7299.00', '4597.00', '/uploads/1faae7a0-70bf-11ea-91a2-9395060d7390.jpg', '', 3, '白色', 2, 1, 1, 100),
(9, 3, 11, '华为MateBook17', '8299.00', '4597.00', '/uploads/1faae7a0-70bf-11ea-91a2-9395060d7390.jpg', '', 3, '白色', 2, 1, 1, 100),
(10, 3, 11, '华为MateBook18', '9299.00', '4597.00', '/uploads/1faae7a0-70bf-11ea-91a2-9395060d7390.jpg', '', 3, '白色', 2, 1, 1, 100),
(11, 3, 11, '华为(HUAWEI)MateBook 13 ', '90001.00', '90000.00', '/uploads/58ff7cd0-e8fd-11ea-a704-bdeb1279090d.png', '<div>华为(HUAWEI)MateBook 13 2020款全面屏轻薄性能笔记本电脑 十代酷睿(i5 16G 512G MX250 触控屏 多屏协同)银</div><div></div><div id="banner-miaosha"><div><i></i>&nbsp;<strong>秒杀预告</strong></div><div><strong>8月29日00:00</strong>秒杀价￥5988</div><div>距离开始还剩08:51:10</div></div><div><div><div><div>京 东 价</div><div>￥5999.00&nbsp;<a href="https://item.jd.com/100011177202.html#none" clstag="shangpin|keycount|product|jiangjia_1">降价通知</a></div></div><div><div id="comment-count" clstag="shangpin|keycount|product|pingjiabtn_1"><p>累计评价</p><a href="https://item.jd.com/100011177202.html#none">6万+</a></div></div><div id="summary-quan" clstag="shangpin|keycount|product|lingquan"></div><div id="J-summary-top" clstag="shangpin|keycount|product|cuxiao"><div id="summary-promotion"><div>促　　销</div><div><div><ins id="prom-mbuy"></ins><ins id="prom-car-gift"></ins><ins id="prom-gift" clstag="shangpin|keycount|product|zengpin_1"></ins><ins id="prom-fujian" clstag="shangpin|keycount|product|fujian_1"></ins><ins id="prom"></ins><ins id="prom-one"></ins><ins id="prom-phone"></ins><ins id="prom-phone-jjg"></ins><ins id="prom-tips"></ins><ins id="prom-quan"></ins><div>展开促销&nbsp;<a href="https://item.jd.com/100011177202.html#none"><i></i></a></div></div></div></div></div></div></div><div><div id="summary-support"><div>增值业务</div><div><ul><li id="support-old2new" clstag="shangpin|keycount|product|zhichi_old2new_672"><a target="_blank" href="https://huishou.jd.com/huanxin?s=1&amp;skuId=100011177202"><i></i>&nbsp;高价回收，极速到账</a></li></ul></div></div><div clstag="shangpin|keycount|product|quyuxuanze_1"><br></div></div>', 3, '白色', 1, 2, 1, 100),
(16, 22, 23, '沙发1234', '1111.00', '11111.00', '/uploads/0d7fe180-e90e-11ea-a704-bdeb1279090d.jpg', '<p>沙发1234沙发1234沙发1234沙发1234沙发1234</p>', 3, '黑色', 1, 1, 1, 100);

-- --------------------------------------------------------

--
-- 表的结构 `member`
--

CREATE TABLE IF NOT EXISTS `member` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) NOT NULL COMMENT '用户编号',
  `phone` char(11) NOT NULL COMMENT '手机号',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `password` char(32) NOT NULL COMMENT '密码',
  `randstr` char(5) NOT NULL COMMENT '密码随机串',
  `addtime` char(13) NOT NULL COMMENT '注册时间',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='会员表' AUTO_INCREMENT=11 ;

--
-- 转存表中的数据 `member`
--

INSERT INTO `member` (`id`, `uid`, `phone`, `nickname`, `password`, `randstr`, `addtime`, `status`) VALUES
(2, '2be08210-70fa-11ea-9c17-a5b3f9b0d2ba', '18811112222', '小U', '', 'O6ImO', '1585403036849', 1),
(3, 'cf431060-94e2-11ea-a222-2d7506ebb3ac', '13716052241', '', '', '', '1589351244904', 1),
(5, '6c841ac0-94e5-11ea-bcf6-033ff179583c', '', '', '', '', '1589352367728', 1),
(7, '3175f110-e77e-11ea-a9fa-27497022fb51', '13694993685', '', '', '', '1598433976993', 1),
(8, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', '15511059559', '', '', '', '1598840634265', 1),
(10, '0ba5b4d0-eb33-11ea-88aa-d9419d1ed31c', '15522223333', '', '', '', '1598841505950', 1);

-- --------------------------------------------------------

--
-- 表的结构 `menu`
--

CREATE TABLE IF NOT EXISTS `menu` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '菜单编号',
  `pid` smallint(6) NOT NULL COMMENT '上级菜单编号',
  `title` varchar(50) NOT NULL COMMENT '菜单名称',
  `icon` varchar(100) NOT NULL COMMENT '菜单图标',
  `type` tinyint(1) NOT NULL COMMENT '菜单类型1目录2菜单',
  `url` varchar(100) NOT NULL COMMENT '菜单地址',
  `status` tinyint(1) NOT NULL COMMENT '菜单状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='后台菜单权限表' AUTO_INCREMENT=16 ;

--
-- 转存表中的数据 `menu`
--

INSERT INTO `menu` (`id`, `pid`, `title`, `icon`, `type`, `url`, `status`) VALUES
(1, 0, '系统设置', 'el-icon-setting', 1, '', 1),
(2, 1, '菜单管理', '', 2, '/menu', 1),
(3, 1, '角色管理', '', 2, '/role', 1),
(7, 1, '管理员管理', '', 2, '/user', 1),
(8, 0, '商城管理', 'el-icon-s-goods', 1, '', 1),
(9, 8, '商品分类', '', 2, '/category', 1),
(10, 8, '商品规格', '', 2, '/specs', 1),
(11, 8, '商品管理', '', 2, '/goods', 1),
(12, 8, '会员管理', '', 2, '/member', 1),
(14, 8, '轮播图管理', '', 2, '/banner', 1),
(15, 8, '秒杀活动', '', 2, '/seckill', 1);

-- --------------------------------------------------------

--
-- 表的结构 `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) DEFAULT NULL COMMENT '会员id',
  `orderid` int(11) DEFAULT NULL COMMENT '主订单id',
  `goodsid` int(11) DEFAULT NULL COMMENT '商品id',
  `num` tinyint(3) DEFAULT NULL COMMENT '购买的商品数量',
  `checked` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=84 ;

--
-- 转存表中的数据 `orders`
--

INSERT INTO `orders` (`id`, `uid`, `orderid`, `goodsid`, `num`, `checked`) VALUES
(79, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', 83, 5, 1, 1),
(80, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', 83, 16, 1, 1),
(81, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', 84, 1, 1, 1),
(82, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', 84, 10, 1, 1),
(83, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', 85, 16, 1, 1);

-- --------------------------------------------------------

--
-- 表的结构 `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '角色编号',
  `rolename` varchar(100) NOT NULL COMMENT '角色名称',
  `menus` varchar(255) NOT NULL COMMENT '菜单权限 存放的是菜单编号，用逗号隔开',
  `status` tinyint(1) NOT NULL COMMENT '角色状态1正常2禁用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='后台用户角色表' AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `role`
--

INSERT INTO `role` (`id`, `rolename`, `menus`, `status`) VALUES
(3, '系统管理员', '1,2,3,7,8,9,10,11,12,13,14,15', 1),
(4, '客服专员', '8,9,10,11,12,13', 1);

-- --------------------------------------------------------

--
-- 表的结构 `seckill`
--

CREATE TABLE IF NOT EXISTS `seckill` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '秒杀表id',
  `title` varchar(100) NOT NULL COMMENT '活动名称',
  `begintime` char(13) NOT NULL COMMENT '秒杀开始时间',
  `endtime` char(13) NOT NULL COMMENT '秒杀结束时间',
  `first_cateid` smallint(5) NOT NULL COMMENT '商品一级分类编号',
  `second_cateid` smallint(5) NOT NULL COMMENT '商品二级分类编号',
  `goodsid` int(11) NOT NULL COMMENT '商品编号',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='限时秒杀活动表' AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `seckill`
--

INSERT INTO `seckill` (`id`, `title`, `begintime`, `endtime`, `first_cateid`, `second_cateid`, `goodsid`, `status`) VALUES
(6, '活动2', '1598889600000', '1598975993000', 2, 10, 4, 1);

-- --------------------------------------------------------

--
-- 表的结构 `shop_order`
--

CREATE TABLE IF NOT EXISTS `shop_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) DEFAULT NULL COMMENT '会员id',
  `username` char(10) DEFAULT NULL COMMENT '收件人姓名',
  `userphone` char(11) DEFAULT NULL COMMENT '收件人手机号',
  `address` varchar(50) DEFAULT NULL COMMENT '收件人地址',
  `countmoney` decimal(10,2) DEFAULT NULL COMMENT '订单支付金额',
  `countnumber` smallint(5) DEFAULT NULL COMMENT '商品数量',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '订单状态：0:是待支付，1是代发货',
  `addtime` datetime DEFAULT NULL COMMENT '订单添加时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=86 ;

--
-- 转存表中的数据 `shop_order`
--

INSERT INTO `shop_order` (`id`, `uid`, `username`, `userphone`, `address`, `countmoney`, `countnumber`, `status`, `addtime`) VALUES
(85, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', 'YouSu', '15811112222', '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层', '111.00', 1, 0, '0000-00-00 00:00:00'),
(83, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', 'YouSu', '15811112222', '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层', '4410.00', 2, 0, '0000-00-00 00:00:00'),
(84, '04152180-eb31-11ea-87ac-dfcbe34c6ba8', 'YouSu', '15811112222', '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层', '12298.00', 2, 0, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `specs`
--

CREATE TABLE IF NOT EXISTS `specs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '规格id',
  `specsname` varchar(50) NOT NULL COMMENT '规格名称',
  `status` tinyint(1) NOT NULL COMMENT '规格状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='商品规格表' AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `specs`
--

INSERT INTO `specs` (`id`, `specsname`, `status`) VALUES
(3, '颜色', 1),
(5, '尺寸', 1);

-- --------------------------------------------------------

--
-- 表的结构 `specs_attr`
--

CREATE TABLE IF NOT EXISTS `specs_attr` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '规格项编号',
  `specsid` int(11) NOT NULL COMMENT '规格的specsid',
  `specsval` varchar(50) NOT NULL COMMENT '规格值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='商品规格明细表' AUTO_INCREMENT=15 ;

--
-- 转存表中的数据 `specs_attr`
--

INSERT INTO `specs_attr` (`id`, `specsid`, `specsval`) VALUES
(7, 5, '55英寸'),
(8, 5, '60英寸'),
(13, 3, '白色'),
(14, 3, '黑色');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '住建',
  `uid` varchar(50) NOT NULL COMMENT '管理员编号',
  `roleid` smallint(5) NOT NULL COMMENT '角色编号',
  `username` varchar(30) NOT NULL COMMENT '用户名',
  `password` char(32) NOT NULL COMMENT '密码',
  `randstr` char(5) NOT NULL COMMENT '随机加密串',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='后台管理员用户表' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `uid`, `roleid`, `username`, `password`, `randstr`, `status`) VALUES
(1, '7f412140-6b72-11ea-a476-bbdc6fb709e3', 3, 'admin', '904793bd8f8b17435798173c6af24eff', 'LFLK8', 1),
(2, 'ef0d6e20-6b72-11ea-86b6-ff96b988db92', 4, 'kefu', '51a956280a6ecc833943d0db633c3bc8', 'N9vs3', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
