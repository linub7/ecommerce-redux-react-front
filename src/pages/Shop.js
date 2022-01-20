import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductsByCount,
  fetchProductsByFilter,
} from '../functions/product';
import { getSubs } from '../functions/sub';
import ProductCard from '../components/cards/ProductCard';
import { Menu, Slider, Checkbox, Radio } from 'antd';
import {
  AntDesignOutlined,
  BgColorsOutlined,
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
  TagsOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { getCategories } from '../functions/category';
import Star from '../components/forms/Star';

const { SubMenu } = Menu;

const Shop = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState('');
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState('');
  const [brands, setBrands] = useState([
    'Apple',
    'Samsung',
    'Microsoft',
    'Lenovo',
    'ASUS',
  ]);
  const [brand, setBrand] = useState('');
  const [colors, setColors] = useState([
    'Black',
    'Brown',
    'Silver',
    'White',
    'Blue',
  ]);
  const [color, setColor] = useState('');
  const [shipping, setShipping] = useState('');

  const divProps = Object.assign({}, props);

  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    // get Categories
    getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // fetch sub categories
    getSubs()
      .then((response) => {
        setSubs(response.data);
      })
      .catch((subError) => {
        console.log(subError);
      });
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 1. load producys by default on page load
  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  // 2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load products based on price range
  useEffect(() => {
    console.log('ok to request');
    fetchProducts({ price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setCategoryIds([]);
    setStar('');
    setSub('');
    setBrand('');
    setColor('');
    setShipping('');
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // 4. load products based on category
  // show categories in a list of checkbox
  const showCategories = () =>
    categories.map((category) => (
      <div key={category._id}>
        <Checkbox
          onChange={handleCheck}
          key={category._id}
          className='pb-2 pl-4 pr-4'
          value={category._id}
          name='category'
          checked={categoryIds.includes(category._id)}
        >
          {category.name}
        </Checkbox>
        <br />
      </div>
    ));
  // hanle check categories
  const handleCheck = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setSub('');
    setStar('');
    setBrand('');
    setColor('');
    setShipping('');
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // index or -1

    // indexOf methhod ?? if not found return -1 else return index
    if (foundInTheState === -1) {
      // not found in the state ===> not checked
      inTheState.push(justChecked);
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState, 1);
    }

    setCategoryIds(inTheState);
    fetchProducts({ category: inTheState });
  };

  // 5. show products by star rating
  const handleStarClick = (num) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setSub('');
    setBrand('');
    setColor('');
    setShipping('');
    setStar(num);
    fetchProducts({ stars: num });
  };
  const showStars = () => (
    <div className='pr-4 pl-4 pb-2'>
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  // 6. show products by sub category
  const showSubs = () =>
    subs.map((sub) => (
      <div
        key={sub._id}
        onClick={() => handleSub(sub)}
        className='p-1 m-1 badge badge-secondary'
        style={{ cursor: 'pointer' }}
      >
        {sub.name}
      </div>
    ));

  const handleSub = (sub) => {
    setSub(sub);
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar('');
    setBrand('');
    setColor('');
    setShipping('');
    fetchProducts({ sub });
  };

  // 7. show products based on brands
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className='pb-1 pl-4 pr-4'
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    setBrand(e.target.value);
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setSub('');
    setStar('');
    setColor('');
    setShipping('');
    fetchProducts({ brand: e.target.value });
  };

  // 8. show products based on colors
  const showColors = () =>
    colors.map((c) => (
      <Radio
        key={c}
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className='pb-1 pl-4 pr-4'
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    setColor(e.target.value);
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setSub('');
    setStar('');
    setBrand('');
    setShipping('');
    fetchProducts({ color: e.target.value });
  };

  // 9. show products based on shipping yes/no
  const showShipping = () => (
    <>
      <Checkbox
        className='pb-2 pl-4 pr-4'
        onChange={handleShippingChange}
        value='Yes'
        checked={shipping === 'Yes'}
      >
        Yes
      </Checkbox>
      <Checkbox
        className='pb-2 pl-4 pr-4'
        onChange={handleShippingChange}
        value='No'
        checked={shipping === 'No'}
      >
        No
      </Checkbox>
    </>
  );

  const handleShippingChange = (e) => {
    setShipping(e.target.value);
    setColor('');
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setSub('');
    setStar('');
    setBrand('');
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3 pt-2'>
          <h4>Search / Filter</h4>
          <hr />
          <Menu
            defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
            mode='inline'
          >
            {/* price */}
            <SubMenu
              key='1'
              title={
                <span className='h6'>
                  <DollarOutlined /> Price
                </span>
              }
            >
              <Slider
                className='ml-4 mr-4'
                tipFormatter={(v) => `$${v}`}
                range
                value={price}
                onChange={handleSlider}
                max='6999'
              />
            </SubMenu>
            {/* categories */}
            <SubMenu
              key='2'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              {showCategories()}
            </SubMenu>
            {/* stars */}
            <SubMenu
              key='3'
              title={
                <span className='h6'>
                  <StarOutlined /> Stars
                </span>
              }
            >
              {showStars()}
            </SubMenu>
            {/* subs */}
            <SubMenu
              key='4'
              title={
                <span className='h6'>
                  <TagsOutlined /> Sub Categories
                </span>
              }
            >
              {showSubs()}
            </SubMenu>
            {/* brands */}
            <SubMenu
              key='5'
              title={
                <span className='h6'>
                  <AntDesignOutlined /> Brands
                </span>
              }
            >
              <div style={{ display: 'table-caption' }} className='pr-5'>
                {showBrands()}
              </div>
            </SubMenu>
            {/* colors */}
            <SubMenu
              key='6'
              title={
                <span className='h6'>
                  <BgColorsOutlined /> Colors
                </span>
              }
            >
              <div style={{ display: 'table-caption' }} className='pr-5'>
                {showColors()}
              </div>
            </SubMenu>
            {/* colors */}
            <SubMenu
              key='7'
              title={
                <span className='h6'>
                  <TransactionOutlined /> Shipping
                </span>
              }
            >
              <div style={{ display: 'inline-block' }}>{showShipping()}</div>
            </SubMenu>
          </Menu>
        </div>
        <div className='col-md-9 pt-2'>
          {loading ? (
            <h4 className='text-danger'>Loading....</h4>
          ) : (
            <h4 className='text-danger'>Products</h4>
          )}

          {products.length < 1 && <p>No Products Found</p>}

          <div className='row pb-5'>
            {products.map((product) => (
              <div key={product._id} className='col-md-4 m-3'>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
