function Footer() {
    return (
        <footer
            style={{
                backgroundColor: '#6f42c1', // same as Navbar
                color: 'white',
                textAlign: 'center',
                padding: '15px 0',
                width: '100%',
            }}
        >
            <div className="container">
                <small>&copy; {new Date().getFullYear()} MyDuka. All rights reserved.</small>
            </div>
        </footer>
    );
}

export default Footer;
