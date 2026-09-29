import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

import Section from "./layout/section";
import Row from "./layout/row";
import Column from "./layout/column";
import Grid from "./layout/grid";
import Container from "./layout/container";
import Card from "./layout/card";
import Divider from "./layout/divider";
import Spacer from "./layout/spacer";

import Heading from "./typography/heading";
import Paragraph from "./typography/paragraph";
import TextBlock from "./typography/text-block";
import RichText from "./typography/rich-text";
import Quote from "./typography/quote";
import CodeBlock from "./typography/code-block";
import Button from "./typography/button";
import CtaBanner from "./typography/cta-banner";

import Accordion from "./content/accordion";
import Tabs from "./content/tabs";
import List from "./content/list";
import Table from "./content/table";
import Timeline from "./content/timeline";
import Badge from "./content/badge";
import StarRating from "./content/star-rating";

import Image from "./media/image";
import Gallery from "./media/gallery";
import Video from "./media/video";
import Audio from "./media/audio";
import PdfViewer from "./media/pdf-viewer";
import Embed from "./media/embed";
import MapEl from "./media/map";

import Navbar from "./navigation/navbar";
import Breadcrumbs from "./navigation/breadcrumbs";
import HomeLink from "./navigation/home-link";
import Anchor from "./navigation/anchor";

import TextInput from "./forms/text-input";
import Textarea from "./forms/textarea";
import Checkbox from "./forms/checkbox";
import Radio from "./forms/radio";
import DatePicker from "./forms/date-picker";
import Email from "./forms/email";
import Phone from "./forms/phone";
import Password from "./forms/password";
import SubmitButton from "./forms/submit-button";

import SocialIcons from "./social/social-icons";
import TeamMembers from "./social/team-members";
import Testimonial from "./social/testimonial";
import LikeButton from "./social/like-button";

import Slider from "./advanced/slider";
import Countdown from "./advanced/countdown";
import Chart from "./advanced/chart";
import ProgressBar from "./advanced/progress-bar";
import Modal from "./advanced/modal";
import Tooltip from "./advanced/tooltip";
import Notification from "./advanced/notification";
import PricingTable from "./advanced/pricing-table";
import ProductCard from "./advanced/product-card";
import CartButton from "./advanced/cart-button";
import LayerStack from "./layout/layer-stack";

export const coreLibrary: ComponentDefinition[] = [
    Section, Row, Column, Grid, Container, Card, LayerStack, Divider, Spacer,
    Heading, Paragraph, TextBlock, RichText, Quote, CodeBlock, Button, CtaBanner,
    Accordion, Tabs, List, Table, Timeline, Badge, StarRating,
    Image, Gallery, Video, Audio, PdfViewer, Embed, MapEl,
    Navbar, Breadcrumbs, HomeLink, Anchor,
    TextInput, Textarea, Checkbox, Radio, DatePicker, Email, Phone, Password, SubmitButton,
    SocialIcons, TeamMembers, Testimonial, LikeButton,
    Slider, Countdown, Chart, ProgressBar, Modal, Tooltip, Notification,
    PricingTable, ProductCard, CartButton,
] as unknown as ComponentDefinition[];