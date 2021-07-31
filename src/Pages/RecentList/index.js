import React, { Component } from "react";
import Header from "../../Components/Header";
import BrandFilter from "../../Components/ProductFilter/BrandFilter";
import HideNoInterestingFilter from "../../Components/ProductFilter/HideNoInterestingFilter";
import OrderFilter from "../../Components/ProductFilter/OrderFilter";
import { Container, FilterOrderContainer, ListContainer } from "./style";
import PropTypes from "prop-types";
import Navbar from "../../Components/Navbar";
import CautionMessage from "../../Modals/CautionMessage";
import Card from "../../Components/Card";

class RecentListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      brand: [],
      selectedBrand: [],
      productData: [],
      selectedProductData: [],
      value: "recentOrder",
    };
  }
  recentOrderFilter = (data) => {
    const sortedData = data.sort((a, b) => b.time - a.time);
    return sortedData;
  };
  lowPriceOrderFilter = (data) => {
    const sortedData = data.sort((a, b) => a.price - b.price);
    return sortedData;
  };

  orderedFiltered = (data) => {
    let sortedData = [];
    if (this.state.value === "recentOrder" && data !== null) {
      sortedData = this.recentOrderFilter(data);
    } else {
      sortedData = this.lowPriceOrderFilter(data);
    }
    this.setState({
      selectProductData: [...sortedData],
    });
    return sortedData;
  };
  selectedOrderedKind = (orderKind, orderData) => {
    this.setState({ value: orderKind }, () =>
      this.orderedFiltered(this.state.selectedProductData)
    );
  };

  openModal = () => {
    this.setState({ open: true });
    const closeTimer = setTimeout(() => {
      this.closeModal();
    }, 2000);
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  goToProduct = () => {
    this.props.history.push("/product");
  };

  makeBrnadData = () => {
    const { productData } = this.state;
    const brandArr = [];
    for (let brand of Object.entries(productData)) {
      brandArr.push(brand[1].brand);
    }
    const settedBrand = new Set(brandArr);
    const uniqeBrandArr = [...settedBrand];
    this.setState({ brand: uniqeBrandArr });
  };

  selectBrand = (event) => {
    const { selectedBrand } = this.state;
    const {
      target: {
        dataset: { kind },
      },
    } = event;
    if (kind === "ALL") return this.setState({ selectedBrand: [] });
    if (selectedBrand.includes(kind))
      return this.setState({
        selectedBrand: selectedBrand.filter((item) => item !== kind),
      });
    this.setState((state) => {
      return { selectedBrand: state.selectedBrand.concat(kind) };
    });
  };

  // componentWillMount() {}

  componentDidMount() {
    // fetch("/MockData/data.json")
    //   .then((response) => response.json())
    //   .then((data) => this.setState({ productData: data }));
    const recentLocalData = JSON.parse(localStorage.getItem("recentList"));
    if (recentLocalData === null) {
      this.setState({
        productData: [],
      });
    } else {
      this.setState({
        productData: [...this.recentOrderFilter(recentLocalData)],
      });
    }
  }

  // componentWillReceiveProps(nextProps) {}

  // shouldComponentUpdate(nextProps, nextState) {}

  // componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {
    const { productData, brand, selectedBrand, selectedProductData } =
      this.state;
    if (productData.length && !brand.length) {
      this.makeBrnadData();
    }
    if (
      productData.length > 0 &&
      !selectedProductData.length &&
      !selectedBrand.length
    ) {
      this.setState({ selectedProductData: [...productData] });
    }
    if (prevState.selectedBrand.length !== selectedBrand?.length) {
      this.setState(
        {
          selectedProductData: productData.filter((product) =>
            selectedBrand.some((p) => [product.brand].includes(p))
          ),
        },
        () => this.orderedFiltered(this.state.selectedProductData)
      );
    }
    if (productData.length > 0 && brand.length === selectedBrand.length) {
      this.setState({ selectedBrand: [] }, () =>
        this.orderedFiltered(this.state.productData)
      );
    }
  }

  // componentWillUnmount() {}

  render() {
    const { brand, selectedProductData, selectedBrand, value } = this.state;
    const { selectBrand, goToProduct } = this;
    return (
      selectedProductData && (
        <Container>
          <Header />
          <FilterOrderContainer>
            <HideNoInterestingFilter />
            <OrderFilter
              value={value}
              selectedOrderedKind={this.selectedOrderedKind}
            />
          </FilterOrderContainer>
          <BrandFilter
            brand={brand}
            selectBrand={selectBrand}
            selectedBrand={selectedBrand}
          />
          <ListContainer>
            {selectedProductData.map((prouduct) => (
              <Card
                key={prouduct.title}
                data={prouduct}
                goToProduct={goToProduct}
              />
            ))}
          </ListContainer>
          <CautionMessage open={this.state.open}></CautionMessage>
        </Container>
      )
    );
  }
}

RecentListPage.propTypes = {};

export default RecentListPage;
